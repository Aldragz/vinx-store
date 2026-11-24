import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        products: {
          where: { inStock: true },
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ success: false, message: 'Game tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, game });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
