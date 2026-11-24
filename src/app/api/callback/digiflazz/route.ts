import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body?.data;

    if (!data || !data.ref_id) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const invoice = data.ref_id;
    const status = data.status; // 'Sukses', 'Pending', 'Gagal'
    const sn = data.sn || '';

    const transaction = await prisma.transaction.findUnique({
      where: { invoice },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    await prisma.transaction.update({
      where: { invoice },
      data: {
        digiflazzStatus:
          status === 'Sukses' ? 'SUCCESS' : status === 'Pending' ? 'PROCESSING' : 'FAILED',
        digiflazzSn: sn || transaction.digiflazzSn,
      },
    });

    return NextResponse.json({ success: true, message: 'Digiflazz status updated' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
