import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { digiflazz } from '@/lib/digiflazz';

export async function GET() {
  try {
    const totalTransactions = await prisma.transaction.count();
    const paidTransactions = await prisma.transaction.count({
      where: { paymentStatus: 'PAID' },
    });
    const successTopups = await prisma.transaction.count({
      where: { digiflazzStatus: 'SUCCESS' },
    });

    const revenueAgg = await prisma.transaction.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
    });

    const recentTransactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const balanceInfo = await digiflazz.checkBalance();
    const settings = await prisma.setting.findUnique({
      where: { id: 'site_settings' },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalTransactions,
        paidTransactions,
        successTopups,
        totalRevenue: revenueAgg._sum.totalAmount || 0,
        digiflazzBalance: balanceInfo.balance ?? 0,
        digiflazzBalanceMsg: balanceInfo.message,
      },
      settings,
      recentTransactions,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
