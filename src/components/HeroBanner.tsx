'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Clock, Award, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden pt-6 pb-12">
      {/* Decorative Sky Blue Glowing Blobs */}
      <div className="glow-sky-blob top-0 left-1/4 w-96 h-96 -translate-y-1/2" />
      <div className="glow-sky-blob top-1/2 right-10 w-80 h-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Banner Card */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-sky-400/30 bg-gradient-to-br from-slate-900/90 via-[#0B1528]/80 to-[#08101E]/90 shadow-[0_20px_50px_rgba(14,165,233,0.15)] backdrop-blur-xl">
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-semibold text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>OFFICIAL TOP UP & VOUCHER PARTNER</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Top Up Kilat, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200">
                  Harga Paling Hemat
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Nikmati kemudahan top-up game favoritmu dalam hitungan detik. Stok langsung dari API Digiflazz dengan jaminan harga termurah, pembayaran otomatis QRIS & Bank, serta garansi akun aman 100%.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/order/mobile-legends"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.8)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  Top Up MLBB Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/lacak"
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-400 text-sky-200 font-semibold text-sm transition-all"
                >
                  Cek Status Pesanan
                </Link>
              </div>
            </div>

            {/* Right Highlights: Flash Promo Promo Card */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-950/60 to-slate-900/80 border border-sky-500/30 shadow-[0_0_30px_rgba(14,165,233,0.15)] relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    PROMO EKSKLUSIF VINX
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30">
                    HEMAT 20%
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                    💎
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Weekly Diamond Pass MLBB</h3>
                    <p className="text-xs text-slate-400">Total 210 Diamonds + 70 Starlight Points</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-black text-sky-300">Rp 28.500</span>
                      <span className="text-xs line-through text-slate-500">Rp 35.000</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/order/mobile-legends"
                  className="mt-4 w-full block text-center py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-bold transition-all"
                >
                  Klaim Promo Ini
                </Link>
              </div>

              {/* Free Fire Promo Card */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔥</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Free Fire 140 Diamonds</p>
                    <p className="text-sm font-bold text-sky-400">Rp 20.000</p>
                  </div>
                </div>
                <Link
                  href="/order/free-fire"
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold"
                >
                  Beli
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/15 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Proses 1-5 Detik</h4>
              <p className="text-[11px] text-slate-400">Otomatis via Digiflazz</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/15 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">100% Legal & Aman</h4>
              <p className="text-[11px] text-slate-400">Garansi anti minus</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/15 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Layanan 24 Jam</h4>
              <p className="text-[11px] text-slate-400">Sistem selalu aktif</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/15 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Diskon Member VIP</h4>
              <p className="text-[11px] text-slate-400">Harga khusus pengguna</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
