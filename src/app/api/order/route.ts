import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { tripay } from '@/lib/tripay';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      gameSlug,
      productId,
      targetUserId,
      targetZoneId,
      targetNickname,
      paymentMethod,
      customerPhone,
      customerEmail,
    } = body;

    if (!gameSlug || !productId || !targetUserId || !paymentMethod || !customerPhone) {
      return NextResponse.json(
        { success: false, message: 'Harap lengkapi semua data pesanan' },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { slug: gameSlug },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!game || !product) {
      return NextResponse.json(
        { success: false, message: 'Game atau produk tidak valid' },
        { status: 404 }
      );
    }

    // Check session
    const currentUser = await getSessionUser();
    const isMember = !!currentUser;
    const finalProductPrice = isMember && product.memberPrice ? product.memberPrice : product.price;

    const { fee, total } = tripay.calculateFee(paymentMethod, finalProductPrice);

    // Generate Invoice code: VNX-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const invoice = `VNX-${dateStr}-${randomHex}`;

    // Create Tripay Payment
    const tripayRes = await tripay.createTransaction({
      method: paymentMethod,
      merchantRef: invoice,
      amount: total,
      customerName: targetNickname || `User ${targetUserId}`,
      customerEmail: customerEmail || currentUser?.email || `${customerPhone}@vinxstore.com`,
      customerPhone,
      orderItems: [
        {
          name: `${game.name} - ${product.name}`,
          price: finalProductPrice,
          quantity: 1,
        },
      ],
    });

    // Save to database
    const transaction = await prisma.transaction.create({
      data: {
        invoice,
        userId: currentUser?.id || null,
        gameSlug: game.slug,
        gameName: game.name,
        targetUserId,
        targetZoneId: targetZoneId || null,
        targetNickname: targetNickname || null,
        productName: product.name,
        productSku: product.sku,
        amount: finalProductPrice,
        fee,
        totalAmount: total,
        paymentMethod,
        paymentChannel: paymentMethod,
        paymentReference: tripayRes.reference,
        paymentQrUrl: tripayRes.qrUrl || null,
        paymentPayCode: tripayRes.payCode || null,
        paymentExpiredAt: tripayRes.expiredAt || new Date(Date.now() + 24 * 3600 * 1000),
        paymentStatus: 'PENDING',
        digiflazzStatus: 'WAITING_PAYMENT',
        customerPhone,
        customerEmail: customerEmail || currentUser?.email || null,
      },
    });

    return NextResponse.json({
      success: true,
      invoice: transaction.invoice,
      reference: transaction.paymentReference,
      totalAmount: transaction.totalAmount,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
