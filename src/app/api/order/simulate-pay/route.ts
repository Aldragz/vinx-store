import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { digiflazz } from '@/lib/digiflazz';

export async function POST(request: Request) {
  try {
    const { invoice } = await request.json();

    const transaction = await prisma.transaction.findUnique({
      where: { invoice },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (transaction.paymentStatus === 'PAID') {
      return NextResponse.json({ success: true, message: 'Pesanan sudah lunas', transaction });
    }

    // 1. Mark as PAID
    await prisma.transaction.update({
      where: { invoice },
      data: {
        paymentStatus: 'PAID',
        digiflazzStatus: 'PROCESSING',
      },
    });

    // 2. Prepare customer number for Digiflazz (e.g. combined userId + zoneId)
    const customerNo = transaction.targetZoneId
      ? `${transaction.targetUserId}${transaction.targetZoneId}`
      : transaction.targetUserId;

    // 3. Trigger Digiflazz Top-up
    const digiflazzRes = await digiflazz.orderTopup({
      buyerSkuCode: transaction.productSku,
      customerNo,
      refId: transaction.invoice,
    });

    // 4. Update transaction status
    const updated = await prisma.transaction.update({
      where: { invoice },
      data: {
        digiflazzRefId: transaction.invoice,
        digiflazzStatus:
          digiflazzRes.status === 'Sukses'
            ? 'SUCCESS'
            : digiflazzRes.status === 'Pending'
            ? 'PROCESSING'
            : 'FAILED',
        digiflazzSn: digiflazzRes.sn || `SN-${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil disimulasikan dan diteruskan ke Digiflazz',
      transaction: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
