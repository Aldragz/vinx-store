import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Tag, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default async function PriceListPage() {
  const games = await prisma.game.findMany({
    include: {
      products: {
        orderBy: { price: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-semibold text-sky-300 mb-2">
            <Tag className="w-3.5 h-3.5 text-sky-400" />
            <span>TRANSPARANSI HARGA DIGIFLAZZ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Daftar Harga Lengkap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Daftar harga produk top up dan voucher resmi di Vinx Store. Nikmati harga member VIP dengan membuat akun gratis.
          </p>
        </div>

        <div className="space-y-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-sky-500/20 backdrop-blur-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={game.thumbnail}
                    alt={game.name}
                    className="w-12 h-12 rounded-xl object-cover border border-sky-400/30"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-white">{game.name}</h2>
                    <span className="text-xs text-slate-400">
                      {game.publisher} • {game.category}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/order/${game.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 text-xs font-bold transition-all w-fit"
                >
                  Beli {game.name}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Products Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800/80">
                      <th className="py-3 px-2 font-semibold">Nama Produk</th>
                      <th className="py-3 px-2 font-semibold">Kode SKU</th>
                      <th className="py-3 px-2 font-semibold">Harga Publik</th>
                      <th className="py-3 px-2 font-semibold text-amber-400">
                        Harga Member VIP
                      </th>
                      <th className="py-3 px-2 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {game.products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-sky-500/5 transition-colors">
                        <td className="py-3.5 px-2 font-bold text-white">{prod.name}</td>
                        <td className="py-3.5 px-2 font-mono text-slate-400">{prod.sku}</td>
                        <td className="py-3.5 px-2 font-extrabold text-sky-400">
                          Rp {prod.price.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-2 font-bold text-amber-300">
                          {prod.memberPrice
                            ? `Rp ${prod.memberPrice.toLocaleString('id-ID')}`
                            : '-'}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Tersedia
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
