import React from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import GameList from '@/components/GameList';
import Footer from '@/components/Footer';
import { ShieldCheck, Zap, Headphones, CheckCircle2, Award, Sparkles } from 'lucide-react';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner />

        {/* Game Catalog Grid with Category Filter & Search */}
        <GameList key={search || 'all'} initialSearch={search || ''} />

        {/* Why Choose Vinx Store Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900/80 via-[#0B1528]/90 to-[#08101E] border border-sky-500/20 shadow-[0_15px_40px_rgba(14,165,233,0.1)] backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                KEUNGGULAN KAMI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Mengapa Memilih <span className="text-sky-400">Vinx Store</span>?
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Solusi terpercaya bagi jutaan gamers di Indonesia untuk pembelian diamond dan voucher digital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-sky-500/15 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Otomasi API Digiflazz</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Semua transaksi langsung dioperasikan oleh server Digiflazz secara real-time. Diamond masuk dalam 1-5 detik setelah pembayaran dikonfirmasi.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-sky-500/15 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">100% Legal & Garansi Anti Minus</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sumber produk resmi langsung dari publisher melalui distributor resmi terdaftar. Akun game Anda aman dari banned maupun pengurangan diamond.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-sky-500/15 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Harga Grosir Member VIP</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Daftar akun di Vinx Store dan nikmati potongan harga eksklusif untuk setiap produk, cocok untuk pemakaian pribadi maupun reseller.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">Pertanyaan Sering Diajukan (FAQ)</h2>
            <p className="text-xs text-slate-400 mt-1">Jawaban seputar top up dan cara transaksi</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-sky-500/15 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                Berapa lama proses diamond atau voucher masuk?
              </h4>
              <p className="text-slate-400 pl-6 leading-relaxed">
                Rata-rata pengiriman berlangsung antara 1 hingga 5 detik secara otomatis begitu pembayaran Anda terverifikasi oleh payment gateway kami.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-sky-500/15 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                Metode pembayaran apa saja yang didukung?
              </h4>
              <p className="text-slate-400 pl-6 leading-relaxed">
                Kami mendukung QRIS (BCA, Mandiri, BRI, BNI, Dana, OVO, GoPay, ShopeePay, LinkAja), Virtual Account bank nasional, serta gerai minimarket.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-sky-500/15 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                Bagaimana jika terjadi kendala pada pesanan?
              </h4>
              <p className="text-slate-400 pl-6 leading-relaxed">
                Anda cukup menyimpan nomor invoice dan menghubungi Customer Service kami melalui WhatsApp. Tim kami siap membantu 24 jam setiap hari.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
