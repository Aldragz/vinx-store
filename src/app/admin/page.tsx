'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Wallet,
  TrendingUp,
  Receipt,
  Server,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface AdminStats {
  totalTransactions: number;
  paidTransactions: number;
  successTopups: number;
  totalRevenue: number;
  digiflazzBalance: number;
  digiflazzBalanceMsg?: string;
}

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  digiflazzUsername: string;
  digiflazzApiKey: string;
  digiflazzMode: string;
  tripayApiKey: string;
  tripayPrivateKey: string;
  tripayMerchantCode: string;
  tripayMode: string;
  whatsappContact: string;
  profitMarginPercent: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Vinx Store',
    siteTagline: 'Pusat Top Up Game & Voucher Cepat, Murah & Terpercaya',
    digiflazzUsername: '',
    digiflazzApiKey: '',
    digiflazzMode: 'development',
    tripayApiKey: '',
    tripayPrivateKey: '',
    tripayMerchantCode: '',
    tripayMode: 'sandbox',
    whatsappContact: '628123456789',
    profitMarginPercent: 5.0,
  });

  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (data.settings) {
          setSettings(data.settings);
        }
        if (data.recentTransactions) {
          setRecentTransactions(data.recentTransactions);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Pengaturan API Digiflazz & Tripay berhasil disimpan!');
        fetchOverview();
      } else {
        setErrorMsg(data.message || 'Gagal menyimpan pengaturan');
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-xs font-semibold text-amber-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ADMIN CONTROL PANEL</span>
            </div>
            <h1 className="text-3xl font-black text-white">Dashboard Vinx Store</h1>
            <p className="text-xs text-slate-400 mt-1">
              Pantau saldo Digiflazz, pergerakan omset, transaksi, dan integrasi payment gateway
            </p>
          </div>

          <button
            onClick={fetchOverview}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-sky-500/30 hover:border-sky-400 text-sky-300 text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Perbarui Data
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Digiflazz Deposit */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-sky-950/70 to-slate-900/90 border border-sky-400/30 shadow-[0_10px_30px_rgba(14,165,233,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Saldo Digiflazz
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">
              Rp {stats?.digiflazzBalance?.toLocaleString('id-ID') ?? '0'}
            </p>
            <p className="text-[11px] text-sky-400/80 mt-1">
              {stats?.digiflazzBalanceMsg || 'Terhubung via API Buyer'}
            </p>
          </div>

          {/* Card 2: Revenue */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-sky-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Omset Masuk
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">
              Rp {stats?.totalRevenue?.toLocaleString('id-ID') ?? '0'}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1">
              {stats?.paidTransactions ?? 0} Pesanan Lunas
            </p>
          </div>

          {/* Card 3: Success Topups */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-sky-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Top Up Terkirim
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">
              {stats?.successTopups ?? 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Sukses via Digiflazz Server
            </p>
          </div>

          {/* Card 4: Total Orders */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-sky-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Invoice Dibuat
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">
              {stats?.totalTransactions ?? 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Dari seluruh channel bayar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Digiflazz & Gateway Settings Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-sky-500/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <Server className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Konfigurasi API Digiflazz</h3>
                  <p className="text-xs text-slate-400">
                    Masukkan akun buyer Digiflazz untuk menyalurkan stok otomatis
                  </p>
                </div>
              </div>

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Username Digiflazz
                  </label>
                  <input
                    type="text"
                    value={settings.digiflazzUsername || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, digiflazzUsername: e.target.value })
                    }
                    placeholder="Contoh: vinxstore_official"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-sky-500/20 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    API Key Digiflazz (Buyer Secret Key)
                  </label>
                  <input
                    type="password"
                    value={settings.digiflazzApiKey || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, digiflazzApiKey: e.target.value })
                    }
                    placeholder="Contoh: dev-xxxxxxx atau prod-xxxxxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-sky-500/20 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Mode Operasi Digiflazz
                    </label>
                    <select
                      value={settings.digiflazzMode}
                      onChange={(e) =>
                        setSettings({ ...settings, digiflazzMode: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-sky-500/20 rounded-xl text-white focus:outline-none focus:border-sky-400 text-xs"
                    >
                      <option value="development">Development (Testing Mode)</option>
                      <option value="production">Production (Real Saldo Live)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Margin Keuntungan (%)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={settings.profitMarginPercent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profitMarginPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-sky-500/20 rounded-xl text-white focus:outline-none focus:border-sky-400 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="font-bold text-slate-200 mb-3">Integrasi Tripay Payment</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Merchant Code Tripay
                      </label>
                      <input
                        type="text"
                        value={settings.tripayMerchantCode || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            tripayMerchantCode: e.target.value,
                          })
                        }
                        placeholder="T12345"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-sky-500/20 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        API Key Tripay
                      </label>
                      <input
                        type="password"
                        value={settings.tripayApiKey || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, tripayApiKey: e.target.value })
                        }
                        placeholder="tripay-api-key"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-sky-500/20 rounded-xl text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan Konfigurasi
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Recent Live Transactions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-sky-500/20 backdrop-blur-xl">
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                10 Transaksi Terakhir
              </h3>

              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{tx.gameName}</span>
                          <span className="font-mono text-[10px] text-sky-400">
                            {tx.invoice}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-0.5">
                          {tx.productName} • Rp {tx.totalAmount.toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {tx.paymentStatus}
                        </span>
                        <Link
                          href={`/invoice/${tx.invoice}`}
                          className="block text-[10px] text-sky-400 hover:underline mt-1"
                        >
                          Lihat Invoice →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-8 text-center">
                  Belum ada transaksi di database.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
