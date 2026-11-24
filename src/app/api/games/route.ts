import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { runDatabaseSeed } from '@/lib/seed';

export async function GET(request: Request) {
  try {
    // Auto-seed if empty
    const count = await prisma.game.count();
    if (count === 0) {
      await runDatabaseSeed();
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (category && category !== 'Semua') {
      where.category = category;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { publisher: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: [{ isPopular: 'desc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ success: true, games });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
