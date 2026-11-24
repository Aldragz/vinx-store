import React from 'react';
import Link from 'next/link';
import { Gamepad2, ShieldCheck, Zap, Heart, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-sky-500/15 bg-[#060A14] text-slate-400 relative overflow-hidden">
      {/* Decorative sky blue ambient backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-sky-500/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                <div className="w-full h-full bg-[#080D1A] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <span className="text-2xl font-black text-white tracking-wider">
                VINX <span className="text-sky-400">STORE</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Vinx Store adalah platform top-up games dan voucher digital terpercaya di Indonesia. Terintegrasi langsung dengan API Digiflazz untuk proses kilat otomatis 1-5 detik, harga kompetitif, serta garansi 100% legal dan aman.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-xs text-sky-300 font-medium">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                Digiflazz API Powered
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Tripay Payment Gateway
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Menu Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  Semua Game
                </Link>
              </li>
              <li>
                <Link href="/lacak" className="hover:text-sky-400 transition-colors">
                  Lacak Status Pesanan
                </Link>
              </li>
              <li>
                <Link href="/pricelist" className="hover:text-sky-400 transition-colors">
                  Daftar Harga Lengkap
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-sky-400 transition-colors">
                  Riwayat Akun Member
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Bantuan & Kontak</h4>
            <p className="text-xs text-slate-400">
              Butuh bantuan dengan pesanan Anda? Customer care kami siap melayani setiap hari 24/7.
            </p>
            <a
              href="https://wa.me/6285141484442?text=Halo%20Admin%20Vinx%20Store%2C%20saya%20butuh%20bantuan"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              WhatsApp CS 24/7
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Vinx Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with luxury sky blue aesthetic for pro gamers.
          </p>
        </div>
      </div>
    </footer>
  );
}
