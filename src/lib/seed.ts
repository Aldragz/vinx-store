import prisma from './prisma';
import bcrypt from 'bcryptjs';

export async function runDatabaseSeed() {
  const existingGames = await prisma.game.count();
  if (existingGames > 0) {
    return { success: true, message: 'Database already seeded' };
  }

  // 1. Create Default Admin & Demo User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@vinxstore.com' },
    update: {},
    create: {
      name: 'Vinx Admin',
      email: 'admin@vinxstore.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '081234567890',
    },
  });

  await prisma.user.upsert({
    where: { email: 'gamer@vinxstore.com' },
    update: {},
    create: {
      name: 'Vinx VIP Gamer',
      email: 'gamer@vinxstore.com',
      password: userPassword,
      role: 'USER',
      phone: '089876543210',
      balance: 50000,
    },
  });

  // 2. Default Site Settings
  await prisma.setting.upsert({
    where: { id: 'site_settings' },
    update: {},
    create: {
      siteName: 'Vinx Store',
      siteTagline: 'Pusat Top Up Game & Voucher Cepat, Murah & Terpercaya',
      digiflazzMode: 'development',
      tripayMode: 'sandbox',
      profitMarginPercent: 5.0,
      whatsappContact: '628123456789',
    },
  });

  // 3. Seed Games & Products
  const gamesData = [
    {
      name: 'Mobile Legends: Bang Bang',
      slug: 'mobile-legends',
      publisher: 'Moonton',
      category: 'Mobile Game',
      isPopular: true,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
      inputGuide: 'Masukkan User ID dan Zone ID. Contoh: 12345678 (1234)',
      requiresZoneId: true,
      userIdLabel: 'User ID',
      zoneIdLabel: 'Zone ID',
      checkIdAvailable: true,
      products: [
        { name: 'Weekly Diamond Pass', sku: 'MLWDP', category: 'Membership', basePrice: 26000, price: 28500, memberPrice: 27500 },
        { name: '86 Diamonds', sku: 'ML86', category: 'Diamond', basePrice: 19500, price: 21500, memberPrice: 20500 },
        { name: '172 Diamonds', sku: 'ML172', category: 'Diamond', basePrice: 38800, price: 42500, memberPrice: 40500 },
        { name: '257 Diamonds', sku: 'ML257', category: 'Diamond', basePrice: 58000, price: 63500, memberPrice: 60500 },
        { name: '344 Diamonds', sku: 'ML344', category: 'Diamond', basePrice: 77500, price: 84900, memberPrice: 81000 },
        { name: '706 Diamonds', sku: 'ML706', category: 'Diamond', basePrice: 155000, price: 169000, memberPrice: 162000 },
        { name: '2195 Diamonds (Special)', sku: 'ML2195', category: 'Diamond', basePrice: 470000, price: 510000, memberPrice: 495000 },
      ],
    },
    {
      name: 'Free Fire',
      slug: 'free-fire',
      publisher: 'Garena',
      category: 'Mobile Game',
      isPopular: true,
      thumbnail: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80',
      inputGuide: 'Masukkan Player ID Free Fire Anda. Contoh: 1234567890',
      requiresZoneId: false,
      userIdLabel: 'Player ID',
      checkIdAvailable: true,
      products: [
        { name: 'Member Mingguan FF', sku: 'FFMEMB', category: 'Membership', basePrice: 28000, price: 31000, memberPrice: 29500 },
        { name: '70 Diamonds', sku: 'FF70', category: 'Diamond', basePrice: 9000, price: 10000, memberPrice: 9500 },
        { name: '140 Diamonds', sku: 'FF140', category: 'Diamond', basePrice: 18000, price: 20000, memberPrice: 19000 },
        { name: '355 Diamonds', sku: 'FF355', category: 'Diamond', basePrice: 45000, price: 49000, memberPrice: 47000 },
        { name: '720 Diamonds', sku: 'FF720', category: 'Diamond', basePrice: 90000, price: 98000, memberPrice: 94000 },
        { name: '1450 Diamonds', sku: 'FF1450', category: 'Diamond', basePrice: 180000, price: 195000, memberPrice: 187000 },
      ],
    },
    {
      name: 'PUBG Mobile',
      slug: 'pubg-mobile',
      publisher: 'Tencent Games',
      category: 'Mobile Game',
      isPopular: true,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
      inputGuide: 'Masukkan User ID PUBG Mobile Anda. Contoh: 5123456789',
      requiresZoneId: false,
      userIdLabel: 'Player ID',
      checkIdAvailable: true,
      products: [
        { name: '60 UC', sku: 'PUBG60', category: 'UC', basePrice: 13500, price: 15000, memberPrice: 14200 },
        { name: '325 UC', sku: 'PUBG325', category: 'UC', basePrice: 70000, price: 77000, memberPrice: 73500 },
        { name: '660 UC (Royale Pass)', sku: 'PUBG660', category: 'UC', basePrice: 140000, price: 153000, memberPrice: 146000 },
        { name: '1800 UC', sku: 'PUBG1800', category: 'UC', basePrice: 350000, price: 380000, memberPrice: 365000 },
      ],
    },
    {
      name: 'Valorant',
      slug: 'valorant',
      publisher: 'Riot Games',
      category: 'PC Game',
      isPopular: true,
      thumbnail: 'https://images.unsplash.com/photo-1552824722-ddab137e466b?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
      inputGuide: 'Masukkan Riot ID lengkap dengan Tagline. Contoh: Vinx#SEA',
      requiresZoneId: false,
      userIdLabel: 'Riot ID & Tagline',
      checkIdAvailable: false,
      products: [
        { name: '475 Points', sku: 'VAL475', category: 'Points', basePrice: 50000, price: 54500, memberPrice: 52000 },
        { name: '1000 Points', sku: 'VAL1000', category: 'Points', basePrice: 100000, price: 108000, memberPrice: 104000 },
        { name: '2050 Points', sku: 'VAL2050', category: 'Points', basePrice: 200000, price: 215000, memberPrice: 208000 },
        { name: '3650 Points (Battle Pass)', sku: 'VAL3650', category: 'Points', basePrice: 350000, price: 375000, memberPrice: 362000 },
      ],
    },
    {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      publisher: 'HoYoverse',
      category: 'Mobile Game',
      isPopular: true,
      thumbnail: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
      inputGuide: 'Masukkan UID Genshin dan pilih Server Anda.',
      requiresZoneId: true,
      userIdLabel: 'UID',
      zoneIdLabel: 'Server (Asia/America/Europe/TW_HK_MO)',
      checkIdAvailable: true,
      products: [
        { name: 'Blessing of the Welkin Moon', sku: 'GENSHINWELKIN', category: 'Blessing', basePrice: 65000, price: 71500, memberPrice: 68000 },
        { name: '60 Genesis Crystals', sku: 'GENSHIN60', category: 'Crystals', basePrice: 14000, price: 15500, memberPrice: 14700 },
        { name: '300 + 30 Genesis Crystals', sku: 'GENSHIN330', category: 'Crystals', basePrice: 70000, price: 77000, memberPrice: 73500 },
        { name: '980 + 110 Genesis Crystals', sku: 'GENSHIN1090', category: 'Crystals', basePrice: 215000, price: 235000, memberPrice: 225000 },
      ],
    },
    {
      name: 'Honor of Kings',
      slug: 'honor-of-kings',
      publisher: 'Level Infinite',
      category: 'Mobile Game',
      isPopular: true,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
      inputGuide: 'Masukkan Player ID Honor of Kings Anda.',
      requiresZoneId: false,
      userIdLabel: 'Player ID',
      checkIdAvailable: true,
      products: [
        { name: 'Weekly Card Plus', sku: 'HOKWEEKLY', category: 'Pass', basePrice: 14000, price: 16000, memberPrice: 15000 },
        { name: '80 Tokens', sku: 'HOK80', category: 'Tokens', basePrice: 14500, price: 16500, memberPrice: 15500 },
        { name: '240 + 17 Tokens', sku: 'HOK257', category: 'Tokens', basePrice: 44000, price: 48500, memberPrice: 46000 },
        { name: '400 + 32 Tokens', sku: 'HOK432', category: 'Tokens', basePrice: 73000, price: 79900, memberPrice: 76000 },
      ],
    },
    {
      name: 'Steam Wallet Code IDR',
      slug: 'steam-wallet',
      publisher: 'Valve',
      category: 'Voucher',
      isPopular: false,
      thumbnail: 'https://images.unsplash.com/photo-1612287232230-e8838d7a16f9?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
      inputGuide: 'Kode voucher Steam akan dikirimkan otomatis ke WhatsApp & Invoice.',
      requiresZoneId: false,
      userIdLabel: 'Nomor WhatsApp Penerima',
      checkIdAvailable: false,
      products: [
        { name: 'Steam Wallet IDR 12.000', sku: 'STEAM12', category: 'Voucher', basePrice: 12500, price: 14000, memberPrice: 13300 },
        { name: 'Steam Wallet IDR 45.000', sku: 'STEAM45', category: 'Voucher', basePrice: 46000, price: 49500, memberPrice: 48000 },
        { name: 'Steam Wallet IDR 90.000', sku: 'STEAM90', category: 'Voucher', basePrice: 92000, price: 98000, memberPrice: 95000 },
        { name: 'Steam Wallet IDR 250.000', sku: 'STEAM250', category: 'Voucher', basePrice: 254000, price: 268000, memberPrice: 261000 },
      ],
    },
    {
      name: 'Google Play Gift Card IDR',
      slug: 'google-play',
      publisher: 'Google',
      category: 'Voucher',
      isPopular: false,
      thumbnail: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
      inputGuide: 'Kode voucher Google Play akan dikirimkan otomatis ke WhatsApp & Invoice.',
      requiresZoneId: false,
      userIdLabel: 'Nomor WhatsApp Penerima',
      checkIdAvailable: false,
      products: [
        { name: 'Google Play IDR 20.000', sku: 'GP20', category: 'Voucher', basePrice: 20500, price: 22000, memberPrice: 21200 },
        { name: 'Google Play IDR 50.000', sku: 'GP50', category: 'Voucher', basePrice: 51000, price: 54500, memberPrice: 53000 },
        { name: 'Google Play IDR 100.000', sku: 'GP100', category: 'Voucher', basePrice: 101500, price: 107000, memberPrice: 104500 },
      ],
    },
  ];

  for (const item of gamesData) {
    const { products, ...gameInfo } = item;
    const game = await prisma.game.create({
      data: gameInfo,
    });

    for (const prod of products) {
      await prisma.product.create({
        data: {
          ...prod,
          gameId: game.id,
        },
      });
    }
  }

  return { success: true, message: 'Database successfully seeded with games and products' };
}
