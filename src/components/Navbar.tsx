'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gamepad2,
  Search,
  ReceiptText,
  User,
  LogOut,
  History,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  balance?: number;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsUserDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#katalog`);
    } else {
      router.push('/#katalog');
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#080D1A]/85 border-b border-sky-500/20 shadow-[0_4px_30px_rgba(14,165,233,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-400 to-cyan-300 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.5)] group-hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] transition-all duration-300">
              <div className="w-full h-full bg-[#080D1A] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400">
                  VINX
                </span>
                <span className="text-2xl font-black tracking-wider text-sky-400">
                  STORE
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-400/30">
                  VIP
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Digiflazz Instant Top-Up
              </span>
            </div>
          </Link>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/70" />
              <input
                type="text"
                placeholder="Cari game favorit (Mobile Legends, Free Fire, dll)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/80 border border-sky-500/20 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 transition-all"
              />
            </div>
          </form>

          {/* Nav Links & Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-sky-300 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/lacak"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-sky-300 transition-colors"
            >
              <ReceiptText className="w-4 h-4 text-sky-400" />
              Lacak Pesanan
            </Link>
            <Link
              href="/pricelist"
              className="text-sm font-medium text-slate-300 hover:text-sky-300 transition-colors"
            >
              Daftar Harga
            </Link>

            {/* User State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-sky-500/30 hover:border-sky-400/70 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-amber-400 font-medium">
                      Member VIP
                    </p>
                  </div>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Login sebagai</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/history"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-sky-300 hover:bg-sky-500/10 rounded-xl transition-colors mt-1"
                    >
                      <History className="w-4 h-4 text-sky-400" />
                      Riwayat Pembelian
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="relative group px-4 py-2 rounded-xl text-sm font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 transition-transform group-hover:scale-105" />
                  <span className="relative flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Daftar Member
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-sky-500/20 text-slate-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 space-y-3 bg-[#080D1A]/95 backdrop-blur-2xl border-b border-sky-500/20">
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/70" />
              <input
                type="text"
                placeholder="Cari game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-sky-500/20 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </form>

          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-300 rounded-lg hover:bg-slate-900"
          >
            Beranda
          </Link>
          <Link
            href="/lacak"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-300 rounded-lg hover:bg-slate-900"
          >
            Lacak Pesanan
          </Link>
          <Link
            href="/pricelist"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-300 rounded-lg hover:bg-slate-900"
          >
            Daftar Harga
          </Link>

          {user ? (
            <>
              <Link
                href="/history"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-sky-300 rounded-lg bg-sky-950/40 border border-sky-500/20"
              >
                Riwayat Pembelian ({user.name})
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-amber-300 rounded-lg bg-amber-950/40 border border-amber-500/20"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-rose-400 rounded-lg hover:bg-rose-950/20"
              >
                Keluar
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-sky-500/30 text-sky-300 font-semibold"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-bold"
              >
                Daftar Member
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
