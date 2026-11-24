'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Wallet,
  User,
  Gamepad2,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface Transaction {
  id: string;
  invoice: string;
  gameName: string;
  targetUserId: string;
  targetZoneId?: string | null;
  targetNickname?: string | null;
  productName: string;
  amount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  digiflazzStatus: string;
  digiflazzSn?: string | null;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  balance: number;
}

export default function HistoryPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [meRes, histRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/user/history'),
      ]);

      const meData = await meRes.json();
      const histData = await histRes.json();

      if (meData.success && meData.user) {
        setUser(meData.user);
      }
      if (histData.success && histData.transactions) {
        setTransactions(histData.transactions);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* User Greeting & Stats Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-[#0B1528] to-[#08101E] border border-sky-500/30 shadow-[0_15px_40px_rgba(14,165,233,0.15)] backdrop-blur-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                <div className="w-full h-full bg-[#080D1A] rounded-[14px] flex items-center justify-center text-white font-black text-2xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {user?.name || 'Gamer Vinx'}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                    MEMBER VIP
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {user?.email || 'Belum login'} • {user?.phone || 'No WhatsApp'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-5 py-3 rounded-2xl bg-slate-950/70 border border-sky-500/20 text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                  Total Transaksi
                </span>
                <span className="text-lg font-black text-sky-400">
                  {transactions.length} Pesanan
                </span>
              </div>
              <Link
                href="/"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-sky-500/40 transition-all"
              >
                + Top Up Baru
              </Link>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-sky-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-bold text-white">Riwayat Pembelian Saya</h2>
            </div>
            <span className="text-xs text-slate-400">
              Menampilkan semua histori pesanan akun Anda
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">Memuat riwayat transaksi...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80">
                    <th className="py-3 px-3 font-semibold">Invoice</th>
                    <th className="py-3 px-3 font-semibold">Game & Akun</th>
                    <th className="py-3 px-3 font-semibold">Produk</th>
                    <th className="py-3 px-3 font-semibold">Total Biaya</th>
                    <th className="py-3 px-3 font-semibold">Pembayaran</th>
                    <th className="py-3 px-3 font-semibold">Status Digiflazz</th>
                    <th className="py-3 px-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {transactions.map((trx) => {
                    const isPaid = trx.paymentStatus === 'PAID';
                    const isSuccess = trx.digiflazzStatus === 'SUCCESS';

                    return (
                      <tr key={trx.id} className="hover:bg-sky-500/5 transition-colors">
                        <td className="py-3.5 px-3">
                          <Link
                            href={`/invoice/${trx.invoice}`}
                            className="font-mono font-bold text-sky-400 hover:underline flex items-center gap-1"
                          >
                            {trx.invoice}
                          </Link>
                          <span className="text-[10px] text-slate-500 block">
                            {new Date(trx.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white">{trx.gameName}</p>
                          <p className="text-[11px] text-slate-400">
                            ID: {trx.targetUserId} {trx.targetZoneId ? `(${trx.targetZoneId})` : ''}
                            {trx.targetNickname && ` • ${trx.targetNickname}`}
                          </p>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-white">
                          {trx.productName}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-sky-400">
                          Rp {trx.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-3">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              Lunas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              Menunggu
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          {isSuccess ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                                Sukses
                              </span>
                              {trx.digiflazzSn && (
                                <span className="block font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                                  SN: {trx.digiflazzSn}
                                </span>
                              )}
                            </div>
                          ) : trx.digiflazzStatus === 'PROCESSING' ? (
                            <span className="text-sky-400 font-semibold text-[11px]">
                              Diproses
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            href={`/invoice/${trx.invoice}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 font-semibold text-[11px] transition-colors"
                          >
                            Detail
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Belum Ada Transaksi</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Anda belum melakukan pembelian apapun di Vinx Store.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
              >
                Mulai Top Up Game
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
