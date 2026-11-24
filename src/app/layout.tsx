import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vinx Store - Top Up Games & Voucher Cepat, Murah & Terpercaya',
  description:
    'Platform top up game & voucher resmi terhubung langsung dengan API Digiflazz. Proses instan 1-5 detik, harga termurah, pembayaran QRIS & Bank otomatis.',
  keywords: [
    'Vinx Store',
    'Top Up Game',
    'Digiflazz',
    'Mobile Legends',
    'Free Fire',
    'PUBG Mobile',
    'Valorant',
    'Genshin Impact',
    'Voucher Game',
    'Top Up Murah',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080D1A] text-slate-100">
        {children}
      </body>
    </html>
  );
}
