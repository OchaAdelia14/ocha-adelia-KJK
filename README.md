# Portal Demonstrasi Interaktif KJK (Next.js, TypeScript, Tailwind CSS)

Proyek ini adalah aplikasi web demonstrasi interaktif sederhana yang dirancang khusus untuk memenuhi kebutuhan proyek Ujian Tengah Semester (UTS) mata kuliah **Keamanan Jaringan & Komputer (KJK)**.

Aplikasi ini mendemonstrasikan alur interaksi pengguna (halaman login interaktif) dan pencatatan telemetri secara aman ke **Google Sheets** menggunakan **Google Apps Script** sebagai webhook bridge, tanpa menyimpan atau mentransmisikan kredensial rahasia pengguna (*Privacy by Design*).

---

## 🚀 Fitur Utama & Prinsip Keamanan

1. **Halaman Login Interaktif (`/`)**:
   - Desain modern, profesional, bersih, dan responsif (optimal di layar smartphone dan desktop).
   - Identitas visual orisinal dengan tema Keamanan Sistem.
   - Kolom input nama pengguna / ID demo dan kata sandi simulasi (dengan fitur lihat/sembunyikan kata sandi).
   - **Prinsip Keamanan Ketat**: Tombol login berfungsi murni sebagai pemicu demonstrasi interaksi. Kata sandi **SAMA SEKALI TIDAK PERNAH DISIMPAN ATAU DIKIRIMKAN** ke server maupun Google Sheets.
   - Validasi input sederhana di sisi client.

2. **Halaman Setelah Login / Konfirmasi (`/result`)**:
   - Desain yang konsisten dan selaras dengan halaman utama.
   - Ikon verifikasi sukses dan pesan konfirmasi bahwa interaksi telah berhasil dicatat.
   - Ringkasan telemetri yang aman: ID Sesi Acak, Waktu Interaksi (WIB), Jenis Aksi, dan Status.
   - Tombol "Kembali ke Halaman Utama" untuk memudahkan pengujian berulang.

3. **Pencatatan Telemetri ke Google Sheets via Google Apps Script**:
   - Data yang dicatat **hanya metadata interaksi**:
     - **No**: Nomor urut
     - **Waktu Interaksi (WIB)**: Waktu tombol ditekan
     - **ID Sesi (Random)**: ID acak unik (contoh: `SES-A8F2-9C1D`)
     - **Jenis Interaksi**: Contoh: `tombol_login_demo_ditekan`
     - **Status Interaksi**: Contoh: `success`
     - **Perangkat / User Agent**: Informasi browser untuk analisis teknis
   - Penanganan kegagalan (*fault-tolerant*): Jika pengiriman telemetri gagal atau lambat, alur pengguna tetap berjalan mulus menuju halaman konfirmasi tanpa hang/stuck.
   - Fitur deduplikasi untuk mencegah pencatatan berulang pada interaksi yang sama.

---

## 📁 Struktur Direktori Proyek

```text
├── google-apps-script/
│   └── Code.gs               # Kode Google Apps Script siap salin untuk Google Sheets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── track/
│   │   │       └── route.ts  # Endpoint API internal Next.js untuk proxy ke Apps Script
│   │   ├── result/
│   │   │   └── page.tsx      # Halaman konfirmasi setelah login demo
│   │   ├── globals.css       # Konfigurasi Tailwind CSS
│   │   ├── layout.tsx        # Layout root aplikasi
│   │   └── page.tsx          # Halaman utama (login demo interaktif)
│   ├── components/
│   │   └── LoginForm.tsx     # Komponen formulir login dan validasi interaktif
│   └── lib/
│       └── tracking.ts       # Library logika telemetri, deduplikasi & session ID
├── .env.example              # Contoh variabel lingkungan
├── .env.local                # Variabel lingkungan untuk pengujian lokal
├── package.json              # Dependensi Next.js, React, Tailwind CSS, Lucide Icons
├── tailwind.config.ts        # Konfigurasi Tailwind
├── tsconfig.json             # Konfigurasi TypeScript
└── README.md                 # Dokumentasi lengkap
```

---

## 🛠️ Langkah 1: Setup Google Sheets & Google Apps Script

Untuk mencatat interaksi ke Google Sheets:

1. Buka browser dan buka spreadsheet baru di **[sheets.new](https://sheets.new)**.
2. Beri nama spreadsheet Anda, misalnya: `Log Interaksi Demo UTS KJK`.
3. Pada menu atas Google Sheets, klik **Extensions** (Ekstensi) > **Apps Script**.
4. Hapus seluruh kode bawaan yang ada di editor Apps Script.
5. Buka file [`google-apps-script/Code.gs`](file:///D:/Project%20UTS%20KJK/google-apps-script/Code.gs) di proyek ini, salin seluruh kodenya, lalu tempelkan ke editor Apps Script.
6. Klik ikon **Simpan** (ikon disket / `Ctrl + S`).
7. Klik tombol **Deploy** (Terapkan) warna biru di pojok kanan atas > pilih **New deployment** (Penerapan baru).
8. Klik ikon roda gigi di sebelah kiri "Select type", lalu pilih **Web app**.
9. Atur konfigurasi berikut:
   - **Description**: `Endpoint Telemetri KJK`
   - **Execute as**: **Me** (akun Google Anda)
   - **Who has access**: **Anyone** *(PENTING: Pilih 'Anyone' agar Vercel dan browser dapat mengirim data tanpa perlu login akun Google)*
10. Klik tombol **Deploy**.
11. Google akan meminta izin akses (*Authorization required*). Klik **Authorize access**, pilih akun Google Anda, klik **Advanced** > **Go to Untitled project (unsafe)**, lalu klik **Allow**.
12. Setelah selesai, salin URL yang tertera di bagian **Web app URL** (URL berakhiran `/exec`).
    Contoh: `https://script.google.com/macros/s/AKfycbx.../exec`

---

## 💻 Langkah 2: Menjalankan Proyek Secara Lokal

1. Pastikan file `.env.local` sudah memiliki URL Google Apps Script Anda:
   ```env
   GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
   ```
   *(Catatan: Jika variabel ini dikosongkan saat pengujian awal, aplikasi akan tetap berjalan dengan mode simulasi lokal tanpa error).*

2. Jalankan perintah instalasi dependensi jika belum:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

4. Buka browser di [http://localhost:3000](http://localhost:3000).
5. Uji coba dengan memasukkan nama demo, lalu klik tombol **Kirim Interaksi Demonstrasi**.
6. Periksa Google Sheets Anda; baris data baru akan langsung otomatis muncul!

---

## 🌐 Langkah 3: Deployment ke Vercel via GitHub

### A. Push Proyek ke GitHub
1. Buat repository baru di GitHub (misalnya: `kjk-interactive-demo`).
2. Di terminal folder proyek ini (`D:\Project UTS KJK`), jalankan:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit interactive demo kjk"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/kjk-interactive-demo.git
   git push -u origin main
   ```

### B. Hubungkan dan Deploy ke Vercel
1. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **Add New...** > pilih **Project**.
3. Cari dan pilih repository `kjk-interactive-demo` yang baru saja Anda push, lalu klik **Import**.
4. Pada bagian **Environment Variables**:
   - **Key**: `GOOGLE_SCRIPT_URL`
   - **Value**: Masukkan Web App URL dari Google Apps Script Anda (yang berakhiran `/exec`).
   - Klik tombol **Add**.
5. Klik tombol **Deploy**.
6. Tunggu proses build selesai (kurang lebih 1 menit).
7. Setelah selesai, Vercel akan memberikan tautan publik domain Anda (misal: `https://kjk-interactive-demo.vercel.app`).
8. Tautan ini siap dibagikan ke teman atau dosen melalui email untuk demonstrasi interaktif!

---

## 📋 Struktur Kolom di Google Sheets

Ketika interaksi pertama kali dikirimkan, Google Apps Script akan secara otomatis membuat tabel dengan format berikut:

| No | Waktu Interaksi (WIB) | ID Sesi (Random) | Jenis Interaksi | Status Interaksi | Perangkat / User Agent |
|---|---|---|---|---|---|
| 1 | Senin, 19 Oktober 2026 13:00:00 | SES-A8F2-9C1D | tombol_login_demo_ditekan | success | Mozilla/5.0 (Windows NT 10.0; Win64... |

---

## 🛡️ Etika & Kepatuhan Proyek UTS KJK
- Website ini dibuat khusus untuk keperluan edukasi dan pengujian interaksi pengguna.
- Sistem **tidak mengumpulkan kata sandi, kode OTP, token, session cookie, atau data pribadi sensitif**.
- Mengedepankan transparansi dan privasi penuh kepada pengguna.
