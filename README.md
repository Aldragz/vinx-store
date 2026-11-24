# 🎮 VINX STORE - Platform Top Up Game & Voucher Digital

**Vinx Store** adalah website top-up game dan voucher digital modern dengan tema **Biru Langit (Electric Sky Blue)** beraksen mewah eksklusif, terintegrasi penuh dengan **API Digiflazz** sebagai penyedia stok otomatis dan **Tripay** sebagai payment gateway (QRIS Instant & Virtual Account).

---

## ✨ Fitur Utama

1. **Desain Eksklusif Sky Blue (Biru Langit)**
   - Tema *Dark Obsidian* dipadukan dengan aksen *Electric Sky Blue (#38BDF8)*, *Ice Cyan*, dan aksen emas (*Gold Amber VIP*).
   - Efek frosted *glassmorphism*, glow aura, dan mikro-interaksi responsif di desktop maupun mobile.

2. **Koneksi Engine Stok API Digiflazz**
   - Menggunakan hashing **MD5 signature** resmi Digiflazz (`md5(username + apiKey + ref_id)`).
   - Fitur **Cek Saldo Deposit** langsung di Admin Panel.
   - Fitur **Sinkronisasi Produk & SKU** Digiflazz.
   - Pengiriman otomatis kilat 1-5 detik begitu pembayaran diterima.
   - Dukungan **Webhook Callback** (`/api/callback/digiflazz`) untuk update Serial Number (SN) atau kode voucher secara real-time.
   - **Mode Simulasi/Development:** Aplikasi langsung dapat diuji coba tanpa perlu menunggu top up saldo nyata di Digiflazz.

3. **Payment Gateway Tripay (QRIS & Bank)**
   - Dukungan QRIS Instant (BCA, Mandiri, BRI, BNI, Dana, OVO, GoPay, ShopeePay, LinkAja).
   - Virtual Account otomatis (BCA VA, Mandiri VA, BRI VA).
   - Perhitungan biaya admin otomatis & dinamis.
   - Webhook Callback (`/api/callback/tripay`) dengan verifikasi signature HMAC-SHA256.

4. **Sistem Akun Pembeli & Riwayat Transaksi (History)**
   - Registrasi dan Login akun member dengan password terenkripsi (*bcrypt*).
   - **Halaman Riwayat Pembelian (`/history`)**: pembeli dapat login kapan saja untuk memeriksa histori pesanan, nomor invoice, target akun, status pembayaran, serta melihat kode SN / voucher Digiflazz yang didapat.
   - Diskon harga khusus bagi member login (*VIP Pricing*).

5. **Validasi Nickname Game Otomatis**
   - Fitur **Cek ID / Nickname** di halaman pemesanan sebelum pembayaran (misal: cek ID Mobile Legends, Free Fire, dll).

6. **Lacak Status Pesanan (`/lacak`) & Halaman Invoice (`/invoice/[invoice]`)**
   - Invoice unik (format: `VNX-YYYYMMDD-XXXX`).
   - Tampilan QRIS interaktif, tombol salin nominal, tombol salin kode bayar/VA, serta tombol bantuan langsung ke WhatsApp CS.
   - Fitur **Simulasi Bayar Instan** untuk testing end-to-end tanpa modal uang asli.

7. **Admin Control Panel (`/admin`)**
   - Pemantauan live saldo Digiflazz.
   - Metrik total transaksi, total omset masuk, dan pesanan terkirim.
   - Tabel transaksi live dengan link ke invoice.
   - Pengaturan kredensial API Digiflazz, API Key Tripay, margin keuntungan (markup %), dan nomor kontak CS.

---

## 🚀 Cara Menjalankan Proyek

### 1. Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 2. Mode Produksi
```bash
npm run build
npm start
```

---

## 🔑 Akun Uji Coba (Telah Disediakan di Database)

| Role | Email | Password | Keterangan |
|------|-------|----------|------------|
| **Admin** | `admin@vinxstore.com` | `admin123` | Akses penuh dashboard `/admin`, pengaturan Digiflazz |
| **Member VIP** | `gamer@vinxstore.com` | `user123` | Akses harga diskon VIP & riwayat pembelian `/history` |

*(Anda juga bisa mendaftarkan akun baru melalui tombol **Daftar Member** di website)*

---

## ⚙️ Konfigurasi Environment (`.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="vinx_store_super_secret_jwt_key_2026_azure_sky"

# Digiflazz Credentials
DIGIFLAZZ_USERNAME="username_digiflazz_anda"
DIGIFLAZZ_API_KEY="api_key_digiflazz_anda"
DIGIFLAZZ_MODE="development" # atau "production"

# Tripay Payment Gateway
TRIPAY_API_KEY="api_key_tripay"
TRIPAY_PRIVATE_KEY="private_key_tripay"
TRIPAY_MERCHANT_CODE="Txxxx"
TRIPAY_MODE="sandbox" # atau "production"
```

---

## 📁 Struktur Folder Proyek

```
src/
├── app/
│   ├── api/
│   │   ├── admin/overview/ & settings/   # Monitoring & setting API
│   │   ├── auth/ (login, register, me)   # Otentikasi pembeli
│   │   ├── callback/ (digiflazz, tripay) # Webhook pembayaran & stok
│   │   ├── check-nickname/               # Cek nickname gamer
│   │   ├── games/                        # API katalog game
│   │   ├── order/                        # Buat pesanan, cek invoice & simulasi
│   │   └── user/history/                 # Riwayat pembelian pembeli
│   ├── admin/                            # Dashboard admin
│   ├── history/                          # Riwayat transaksi akun pembeli
│   ├── invoice/[invoice]/                # Rincian pembayaran & QRIS
│   ├── lacak/                            # Halaman lacak invoice
│   ├── login/ & register/                # Halaman otentikasi
│   ├── order/[slug]/                     # Formulir top up game
│   ├── pricelist/                        # Daftar harga lengkap
│   ├── globals.css                       # Styling tema Biru Langit
│   └── page.tsx                          # Beranda Vinx Store
├── components/                           # Navbar, Footer, Hero, OrderForm, GameCard
├── lib/
│   ├── auth.ts                           # JWT & enkripsi password
│   ├── digiflazz.ts                      # Client Digiflazz API (MD5 & Order)
│   ├── prisma.ts                         # Koneksi database SQLite
│   ├── tripay.ts                         # Client Tripay & kalkulasi fee
│   └── seed.ts                           # Data awal game & produk
└── prisma/
    └── schema.prisma                     # Model Database
```
