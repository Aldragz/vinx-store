import { NextResponse } from 'next/server';
import { runDatabaseSeed } from '@/lib/seed';

export async function GET() {
  try {
    const res = await runDatabaseSeed();
    return NextResponse.json(res);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
