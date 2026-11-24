'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Zap,
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
  ShieldCheck,
  Loader2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { tripay, PAYMENT_CHANNELS } from '@/lib/tripay';

interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string | null;
  basePrice: number;
  price: number;
  memberPrice?: number | null;
  inStock: boolean;
}

interface GameDetail {
  id: string;
  name: string;
  slug: string;
  publisher: string;
  category: string;
  thumbnail: string;
  banner?: string | null;
  inputGuide?: string | null;
  requiresZoneId: boolean;
  userIdLabel?: string | null;
  zoneIdLabel?: string | null;
  checkIdAvailable: boolean;
  products: Product[];
}

export default function OrderForm({
  game,
  isLoggedIn,
}: {
  game: GameDetail;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  // Form states
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [nickname, setNickname] = useState('');
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string>('QRIS');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Group products by category
  const categories = Array.from(
    new Set(game.products.map((p) => p.category || 'Semua Produk'))
  );
  const [activeProductTab, setActiveProductTab] = useState<string>(
    categories[0] || 'Semua Produk'
  );

  const filteredProducts = game.products.filter(
    (p) => (p.category || 'Semua Produk') === activeProductTab
  );

  const selectedProduct = game.products.find((p) => p.id === selectedProductId);

  // Check Nickname Handler
  const handleCheckNickname = async () => {
    if (!userId.trim()) {
      setErrorMsg('Harap isi ID akun game Anda');
      return;
    }
    setErrorMsg('');
    setCheckingNickname(true);
    try {
      const res = await fetch('/api/check-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSlug: game.slug,
          userId: userId.trim(),
          zoneId: zoneId.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.nickname) {
        setNickname(data.nickname);
        setNicknameChecked(true);
      }
    } catch {
      // ignore
    } finally {
      setCheckingNickname(false);
    }
  };

  // Pricing calculations
  const productPrice = selectedProduct
    ? isLoggedIn && selectedProduct.memberPrice
      ? selectedProduct.memberPrice
      : selectedProduct.price
    : 0;

  const currentChannel =
    PAYMENT_CHANNELS.find((c) => c.code === selectedPaymentCode) || PAYMENT_CHANNELS[0];
  const feePercentVal = Math.round((productPrice * currentChannel.feePercent) / 100);
  const totalAdminFee = currentChannel.feeFlat + feePercentVal;
  const grandTotal = productPrice > 0 ? productPrice + totalAdminFee : 0;

  // Handle Order submit
  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!userId.trim()) {
      setErrorMsg('Harap isi Game ID akun Anda');
      return;
    }
    if (game.requiresZoneId && !zoneId.trim()) {
      setErrorMsg(`Harap isi ${game.zoneIdLabel || 'Server ID'}`);
      return;
    }
    if (!selectedProductId) {
      setErrorMsg('Harap pilih salah satu nominal produk');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg('Harap masukkan nomor WhatsApp untuk penerimaan invoice');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleExecuteOrder = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSlug: game.slug,
          productId: selectedProductId,
          targetUserId: userId.trim(),
          targetZoneId: zoneId.trim() || undefined,
          targetNickname: nickname || undefined,
          paymentMethod: selectedPaymentCode,
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.invoice) {
        router.push(`/invoice/${data.invoice}`);
      } else {
        setErrorMsg(data.message || 'Gagal membuat pesanan');
        setShowConfirmModal(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Terjadi kesalahan: ${msg}`);
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleOpenConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: 4 Steps */}
      <div className="lg:col-span-8 space-y-8">
        {/* STEP 1: USER ACCOUNT DATA */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-sky-500/20 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Masukkan Data Akun</h3>
              <p className="text-xs text-slate-400">
                {game.inputGuide || 'Harap pastikan User ID akun game Anda sudah benar'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className={game.requiresZoneId ? 'sm:col-span-7' : 'sm:col-span-12'}>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {game.userIdLabel || 'User ID'} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder={game.requiresZoneId ? 'Contoh: 12345678' : 'Contoh: 1234567890'}
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setNicknameChecked(false);
                }}
                className="w-full px-4 py-3 bg-slate-950/80 border border-sky-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 text-sm"
                required
              />
            </div>

            {game.requiresZoneId && (
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {game.zoneIdLabel || 'Zone / Server ID'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 1234"
                  value={zoneId}
                  onChange={(e) => {
                    setZoneId(e.target.value);
                    setNicknameChecked(false);
                  }}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-sky-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 text-sm"
                  required
                />
              </div>
            )}
          </div>

          {/* Nickname Verification Feature */}
          {game.checkIdAvailable && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {nicknameChecked ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Nickname: {nickname}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-sky-400" />
                    Klik cek ID untuk memastikan nama akun Anda sesuai
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={checkingNickname || !userId.trim()}
                className="px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-300 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {checkingNickname ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Memeriksa...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Cek Nickname
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* STEP 2: SELECT NOMINAL / PRODUCT */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-sky-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pilih Nominal Top Up</h3>
                <p className="text-xs text-slate-400">Pilih item yang ingin Anda beli</p>
              </div>
            </div>

            {isLoggedIn && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                Harga VIP Aktif
              </span>
            )}
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveProductTab(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeProductTab === cat
                      ? 'bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-sky-500/15'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredProducts.map((prod) => {
              const isSelected = selectedProductId === prod.id;
              const displayPrice =
                isLoggedIn && prod.memberPrice ? prod.memberPrice : prod.price;

              return (
                <button
                  type="button"
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`relative p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-sky-950/80 to-slate-900 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-[1.02]'
                      : 'bg-slate-950/60 hover:bg-slate-900 border-sky-500/15 hover:border-sky-400/40'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {prod.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
                      Instan 1-5 Detik
                    </span>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800">
                    <p className="text-sm font-extrabold text-sky-400">
                      Rp {displayPrice.toLocaleString('id-ID')}
                    </p>
                    {isLoggedIn && prod.memberPrice && (
                      <p className="text-[10px] text-amber-400 font-medium">
                        VIP Member
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: PAYMENT METHOD */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-sky-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              3
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Pilih Pembayaran</h3>
              <p className="text-xs text-slate-400">Pembayaran otomatis langsung terverifikasi</p>
            </div>
          </div>

          <div className="space-y-3">
            {PAYMENT_CHANNELS.map((channel) => {
              const isSelected = selectedPaymentCode === channel.code;
              const { total } = tripay.calculateFee(channel.code, productPrice);

              return (
                <div
                  key={channel.code}
                  onClick={() => setSelectedPaymentCode(channel.code)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-950/80 to-slate-900 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                      : 'bg-slate-950/60 hover:bg-slate-900 border-sky-500/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      {channel.code === 'QRIS' ? (
                        <QrCode className="w-5 h-5 text-sky-400" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-sky-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {channel.name}
                        </span>
                        {channel.code === 'QRIS' && (
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                            INSTAN
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {channel.group}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-sky-400">
                      Rp {total > 0 ? total.toLocaleString('id-ID') : '-'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {channel.feeFlat > 0
                        ? `Biaya: +Rp ${channel.feeFlat.toLocaleString('id-ID')}`
                        : `Biaya: +${channel.feePercent}%`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 4: CONTACT INFO */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-sky-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              4
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Kontak Penerima Invoice</h3>
              <p className="text-xs text-slate-400">Bukti pembayaran akan dikirim via WhatsApp</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                No. WhatsApp <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-sky-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email (Opsional)
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/80 border border-sky-500/30 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
      <div className="lg:col-span-4">
        <div className="sticky top-28 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 to-[#0B1528]/95 border border-sky-500/30 shadow-[0_15px_40px_rgba(14,165,233,0.15)] backdrop-blur-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sky-500/20">
            <img
              src={game.thumbnail}
              alt={game.name}
              className="w-14 h-14 rounded-2xl object-cover border border-sky-400/40 shadow-md"
            />
            <div>
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                {game.publisher}
              </span>
              <h4 className="text-base font-black text-white leading-tight">
                {game.name}
              </h4>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Tujuan Top Up</span>
              <span className="text-white font-semibold">
                {userId ? `${userId} ${zoneId ? `(${zoneId})` : ''}` : '-'}
              </span>
            </div>

            {nickname && (
              <div className="flex justify-between text-slate-400">
                <span>Nickname</span>
                <span className="text-emerald-400 font-semibold">{nickname}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Item Nominal</span>
              <span className="text-white font-semibold">
                {selectedProduct ? selectedProduct.name : '-'}
              </span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Metode Bayar</span>
              <span className="text-sky-300 font-semibold">
                {currentChannel.name}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Harga Produk</span>
                <span>Rp {productPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Biaya Layanan</span>
                <span>Rp {totalAdminFee.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-sky-500/20 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total Pembayaran</span>
              <span className="text-xl font-black text-sky-400">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            Beli Sekarang
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Transaksi Terenkripsi & Terlindungi
            </span>
          </div>
        </div>
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 bg-slate-900 border border-sky-500/40 shadow-2xl space-y-6 relative">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white">Konfirmasi Pesanan</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pastikan data akun sudah benar sebelum melanjutkan ke pembayaran
              </p>
            </div>

            <div className="rounded-2xl p-4 bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Game</span>
                <span className="font-bold text-white">{game.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID</span>
                <span className="font-bold text-sky-400">
                  {userId} {zoneId ? `(${zoneId})` : ''}
                </span>
              </div>
              {nickname && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Nickname</span>
                  <span className="font-bold text-emerald-400">{nickname}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Item Produk</span>
                <span className="font-bold text-white">
                  {selectedProduct?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Bayar</span>
                <span className="font-bold text-sky-300">
                  {currentChannel.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor WhatsApp</span>
                <span className="font-bold text-white">{customerPhone}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                <span className="font-bold text-white">Total Tagihan</span>
                <span className="font-black text-sky-400">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteOrder}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Lanjut Bayar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
