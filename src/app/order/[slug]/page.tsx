import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderForm from '@/components/OrderForm';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default async function GameOrderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
    notFound();
  }

  const currentUser = await getSessionUser();

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
      <Navbar />

      {/* Hero Banner Header for the Game */}
      <div className="relative overflow-hidden pt-8 pb-12 border-b border-sky-500/15">
        {/* Sky Blue Glow background */}
        <div className="glow-sky-blob top-0 left-1/3 w-96 h-96 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-sky-400/40 shadow-[0_0_35px_rgba(56,189,248,0.35)] shrink-0">
              <img
                src={game.thumbnail}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-semibold text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{game.category} • {game.publisher}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {game.name}
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Top up {game.name} resmi & termurah di Vinx Store. Proses instan 1-5 detik langsung masuk ke akun tanpa antri.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Order Form Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
        <OrderForm game={game} isLoggedIn={!!currentUser} />
      </main>

      <Footer />
    </div>
  );
}
