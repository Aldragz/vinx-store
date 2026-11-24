'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ReceiptText, Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LacakPesananPage() {
  const router = useRouter();
  const [invoiceInput, setInvoiceInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInvoice = invoiceInput.trim().toUpperCase();
    if (!cleanInvoice) {
      setErrorMsg('Harap masukkan nomor invoice Anda');
      return;
    }
    router.push(`/invoice/${cleanInvoice}`);
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="glow-sky-blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96" />

        <div className="max-w-md w-full relative z-10 rounded-3xl p-8 bg-slate-900/80 border border-sky-500/30 shadow-[0_20px_50px_rgba(14,165,233,0.15)] backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto mb-4 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <ReceiptText className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">Lacak Pesanan</h1>
            <p className="text-xs text-slate-400 mt-1">
              Masukkan nomor invoice transaksi untuk memeriksa status pembayaran & pengiriman Digiflazz
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nomor Invoice
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                <input
                  type="text"
                  placeholder="Contoh: VNX-20261120-XXXX"
                  value={invoiceInput}
                  onChange={(e) => {
                    setInvoiceInput(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-sky-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 uppercase font-mono text-sm"
                  required
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-400 mt-1.5">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] transition-all flex items-center justify-center gap-2"
            >
              Cek Status Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Status pesanan diupdate secara real-time
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
