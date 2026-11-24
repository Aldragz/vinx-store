import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { tripay } from '@/lib/tripay';
import { digiflazz } from '@/lib/digiflazz';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-callback-signature') || '';

    // Verify signature
    if (!tripay.verifyCallback(rawBody, signature)) {
      return NextResponse.json({ success: false, message: 'Invalid callback signature' }, { status: 403 });
    }

    const payload = JSON.parse(rawBody);
    const invoice = payload.merchant_ref;
    const status = payload.status; // 'PAID', 'EXPIRED', 'FAILED'

    const transaction = await prisma.transaction.findUnique({
      where: { invoice },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 });
    }

    if (status === 'PAID' && transaction.paymentStatus !== 'PAID') {
      // 1. Update payment to PAID
      await prisma.transaction.update({
        where: { invoice },
        data: {
          paymentStatus: 'PAID',
          digiflazzStatus: 'PROCESSING',
        },
      });

      // 2. Dispatch to Digiflazz
      const customerNo = transaction.targetZoneId
        ? `${transaction.targetUserId}${transaction.targetZoneId}`
        : transaction.targetUserId;

      const digiRes = await digiflazz.orderTopup({
        buyerSkuCode: transaction.productSku,
        customerNo,
        refId: transaction.invoice,
      });

      await prisma.transaction.update({
        where: { invoice },
        data: {
          digiflazzRefId: transaction.invoice,
          digiflazzStatus:
            digiRes.status === 'Sukses'
              ? 'SUCCESS'
              : digiRes.status === 'Pending'
              ? 'PROCESSING'
              : 'FAILED',
          digiflazzSn: digiRes.sn || '',
        },
      });
    } else if (status === 'EXPIRED') {
      await prisma.transaction.update({
        where: { invoice },
        data: { paymentStatus: 'EXPIRED' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
