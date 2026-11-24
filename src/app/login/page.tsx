'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, Gamepad2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(data.user?.role === 'ADMIN' ? '/admin' : '/history');
        router.refresh();
      } else {
        setErrorMsg(data.message || 'Login gagal');
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="glow-sky-blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96" />

        <div className="max-w-md w-full relative z-10 rounded-3xl p-8 bg-slate-900/80 border border-sky-500/30 shadow-[0_20px_50px_rgba(14,165,233,0.15)] backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 mx-auto mb-4 shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              <div className="w-full h-full bg-[#080D1A] rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-7 h-7 text-sky-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white">Masuk Akun Vinx Store</h1>
            <p className="text-xs text-slate-400 mt-1">
              Akses harga member VIP dan riwayat pembelian Anda
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-sky-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-sky-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-2">
              Akun Uji Coba Cepat (Tersedia):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleUseDemo('gamer@vinxstore.com', 'user123')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-[11px] font-semibold border border-sky-400/20"
              >
                Member Gamer
              </button>
              <button
                type="button"
                onClick={() => handleUseDemo('admin@vinxstore.com', 'admin123')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-400/20"
              >
                Admin Store
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Belum punya akun?{' '}
            <Link href="/register" className="text-sky-400 font-bold hover:underline">
              Daftar Member Gratis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
