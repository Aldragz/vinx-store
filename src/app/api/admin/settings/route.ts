import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Akses ditolak (Hanya Admin)' }, { status: 403 });
    }

    const body = await request.json();
    const {
      siteName,
      siteTagline,
      digiflazzUsername,
      digiflazzApiKey,
      digiflazzMode,
      tripayApiKey,
      tripayPrivateKey,
      tripayMerchantCode,
      tripayMode,
      whatsappContact,
      profitMarginPercent,
    } = body;

    const updated = await prisma.setting.upsert({
      where: { id: 'site_settings' },
      update: {
        siteName,
        siteTagline,
        digiflazzUsername,
        digiflazzApiKey,
        digiflazzMode,
        tripayApiKey,
        tripayPrivateKey,
        tripayMerchantCode,
        tripayMode,
        whatsappContact,
        profitMarginPercent: Number(profitMarginPercent) || 5.0,
      },
      create: {
        id: 'site_settings',
        siteName: siteName || 'Vinx Store',
        siteTagline: siteTagline || 'Pusat Top Up Game & Voucher',
        digiflazzUsername,
        digiflazzApiKey,
        digiflazzMode: digiflazzMode || 'development',
        tripayApiKey,
        tripayPrivateKey,
        tripayMerchantCode,
        tripayMode: tripayMode || 'sandbox',
        whatsappContact: whatsappContact || '628123456789',
        profitMarginPercent: Number(profitMarginPercent) || 5.0,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
