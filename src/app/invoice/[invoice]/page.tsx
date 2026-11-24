'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Zap,
  Loader2,
  Check,
} from 'lucide-react';

interface TransactionDetail {
  id: string;
  invoice: string;
  gameName: string;
  targetUserId: string;
  targetZoneId?: string | null;
  targetNickname?: string | null;
  productName: string;
  amount: number;
  fee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentQrUrl?: string | null;
  paymentPayCode?: string | null;
  paymentExpiredAt?: string | null;
  paymentStatus: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  digiflazzStatus: 'WAITING_PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  digiflazzSn?: string | null;
  customerPhone: string;
  createdAt: string;
}

export default function InvoicePage() {
  const params = useParams();
  const invoice = params?.invoice as string;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  useEffect(() => {
    if (!invoice) return;
    fetchTransaction();
    const interval = setInterval(fetchTransaction, 6000);
    return () => clearInterval(interval);
  }, [invoice]);

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`/api/order/${invoice}`);
      const data = await res.json();
      if (data.success && data.transaction) {
        setTransaction(data.transaction);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Simulate Instant Payment for testing Digiflazz flow
  const handleSimulatePayment = async () => {
    setSimulatingPayment(true);
    try {
      const res = await fetch('/api/order/simulate-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice }),
      });
      const data = await res.json();
      if (data.success && data.transaction) {
        setTransaction(data.transaction);
      }
    } catch {
      // ignore
    } finally {
      setSimulatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-sky-400 animate-spin mb-4" />
          <p className="text-sm text-slate-400">Memuat rincian invoice {invoice}...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto my-32 text-center p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Invoice Tidak Ditemukan</h2>
          <p className="text-sm text-slate-400 mt-1">
            Nomor invoice &quot;{invoice}&quot; tidak terdaftar di sistem Vinx Store.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isPaid = transaction.paymentStatus === 'PAID';
  const isDigiSuccess = transaction.digiflazzStatus === 'SUCCESS';

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full relative z-10">
        {/* Status Card Header */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-[#0B1528] to-[#08101E] border border-sky-500/30 shadow-[0_20px_50px_rgba(14,165,233,0.15)] backdrop-blur-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Invoice Resmi Vinx Store
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
                {transaction.invoice}
                <button
                  onClick={() => handleCopy(transaction.invoice, 'invoice')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Salin Invoice"
                >
                  {copiedText === 'invoice' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Waktu Transaksi:{' '}
                {new Date(transaction.createdAt).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            {/* Dynamic Status Badge */}
            <div className="flex flex-col sm:items-end">
              {isPaid ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Lunas & Terverifikasi
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                  Menunggu Pembayaran
                </div>
              )}

              {/* Digiflazz Process Badge */}
              <div className="mt-2 text-xs font-semibold flex items-center gap-1.5">
                <span className="text-slate-400">Status Pengiriman:</span>
                {isDigiSuccess ? (
                  <span className="text-emerald-400 font-bold">Sukses Terkirim</span>
                ) : transaction.digiflazzStatus === 'PROCESSING' ? (
                  <span className="text-sky-400 font-bold">Sedang Diproses Digiflazz...</span>
                ) : (
                  <span className="text-slate-400">Menunggu Pelunasan</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* PAYMENT INSTRUCTIONS CARD */}
          <div className="md:col-span-7 space-y-6">
            {!isPaid ? (
              <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-sky-500/30 backdrop-blur-xl">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-white">Instruksi Pembayaran</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Silakan bayar sesuai nominal tepat sebelum batas waktu habis
                  </p>
                </div>

                {/* QRIS Display */}
                {transaction.paymentMethod === 'QRIS' && transaction.paymentQrUrl && (
                  <div className="flex flex-col items-center">
                    <div className="p-4 rounded-2xl bg-white shadow-2xl mb-4 border-2 border-sky-400">
                      <img
                        src={transaction.paymentQrUrl}
                        alt="QRIS Vinx Store"
                        className="w-56 h-56 object-contain"
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Pindai QRIS di atas menggunakan aplikasi Bank atau E-Wallet apa saja
                    </span>
                  </div>
                )}

                {/* Virtual Account / PayCode Display */}
                {transaction.paymentPayCode && (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-500/30 my-4 text-center">
                    <span className="text-xs text-slate-400 block mb-1">
                      Nomor Virtual Account / Kode Pembayaran:
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl font-black text-sky-400 tracking-wider">
                        {transaction.paymentPayCode}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(transaction.paymentPayCode || '', 'paycode')
                        }
                        className="p-2 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30"
                      >
                        {copiedText === 'paycode' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Amount to pay */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-500/20 my-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Total Nominal Pembayaran</span>
                    <p className="text-xl font-black text-white">
                      Rp {transaction.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(String(transaction.totalAmount), 'amount')
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    {copiedText === 'amount' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Salin Total
                      </>
                    )}
                  </button>
                </div>

                {/* DEV SIMULATOR BUTTON */}
                <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-3">
                    <Zap className="w-4 h-4" />
                    Mode Uji Coba / Developer:
                  </div>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={simulatingPayment}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] flex items-center justify-center gap-2"
                  >
                    {simulatingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memproses ke Digiflazz...
                      </>
                    ) : (
                      '⚡ Simulasi Pembayaran Sukses (Auto Kirim Digiflazz)'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* SUCCESS STATE */
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 backdrop-blur-xl space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Top Up Berhasil Diproses!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Pesanan Anda telah berhasil diverifikasi dan dikirim ke akun game
                  </p>
                </div>

                {/* Digiflazz SN / Token Receipt */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Kode Serial Number / SN Digiflazz:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-white break-all">
                      {transaction.digiflazzSn || 'SEDANG_MEMUAT_SN'}
                    </span>
                    {transaction.digiflazzSn && (
                      <button
                        onClick={() =>
                          handleCopy(transaction.digiflazzSn || '', 'sn')
                        }
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      >
                        {copiedText === 'sn' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/628123456789?text=Halo%20Admin%2C%20saya%20sudah%20membayar%20pesanan%20${transaction.invoice}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Hubungi CS WhatsApp Jika Ada Kendala
                  </a>
                  <Link
                    href="/"
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center"
                  >
                    Top Up Game Lainnya
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY RIGHT CARD */}
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 bg-slate-900/80 border border-sky-500/20 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
                Rincian Pesanan
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Game</span>
                  <span className="font-bold text-white">{transaction.gameName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">User ID</span>
                  <span className="font-bold text-sky-400">
                    {transaction.targetUserId}{' '}
                    {transaction.targetZoneId ? `(${transaction.targetZoneId})` : ''}
                  </span>
                </div>

                {transaction.targetNickname && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nickname Akun</span>
                    <span className="font-bold text-emerald-400">
                      {transaction.targetNickname}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Item Produk</span>
                  <span className="font-bold text-white">
                    {transaction.productName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Metode Pembayaran</span>
                  <span className="font-bold text-sky-300">
                    {transaction.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">WhatsApp Pelanggan</span>
                  <span className="font-bold text-white">
                    {transaction.customerPhone}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Harga Item</span>
                    <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Biaya Layanan Gateway</span>
                    <span>Rp {transaction.fee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-sky-500/20">
                    <span>Total Pembayaran</span>
                    <span className="text-sky-400 font-black">
                      Rp {transaction.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <p className="font-semibold text-white">Sistem Otomatis Terhubung</p>
                <p className="text-slate-400 mt-0.5">
                  Begitu pembayaran terdeteksi, saldo dan item langsung diinject otomatis ke akun game Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
