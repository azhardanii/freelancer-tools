# RemoteRate by Uqi

> **Kalkulator Rate Freelance & Remote Worker Objektif**  
> Dibuat oleh [Azhar Dani (Uqi)](https://azhardanii.github.io) untuk talenta freelance & remote worker Indonesia bersama **Lab Sekolah WFA**.

---

## 🎯 Gambaran Aplikasi

Banyak calon freelancer dan praktisi remote yang kesulitan menentukan harga jasanya: takut kemahalan sehingga ditolak calon klien, atau sebaliknya pasang harga terlalu murah hingga merugi dan burnout.

**RemoteRate by Uqi** hadir untuk menjawab kegelisahan tersebut:
1. **Engine Deterministik:** Menghitung **Tarif Minimum Aman** (batas aman per jam dan per unit) agar target pendapatan bulanan pasti tercapai setelah memperhitungkan jam kerja produktif, modal bulanan, dan dana cadangan.
2. **Paket Tarif 3 Level:** Menghasilkan rekomendasi paket **Basic (0.7x)**, **Standard (1.0x)**, dan **Premium (1.6x)** secara otomatis berdasarkan riset pasar freelance Indonesia dan penyesuaian bukti kerja.
3. **Analisis Kapasitas (Gap Analysis):** Membandingkan berapa unit proyek yang harus didapat per bulan vs kapasitas jam kerja produktif.
4. **Paket Perdana Khusus:** Rekomendasi strategi diskon awal 30% untuk 2–3 klien pertama bagi pemula yang belum punya portofolio untuk ditukar dengan testimoni tertulis dan izin studi kasus.
5. **Script Negosiasi Siap Pakai:** Balasan taktis 1-klik untuk 3 skenario: *Klien bilang kemahalan*, *Klien minta diskon*, dan *Klien minta tambah scope gratis*.
6. **Dashboard Analytics Real-Time:** Monitoring live pengunjung, corong konversi validasi, feedback persepsi harga, serta ekspor daftar leads waitlist versi Pro ke CSV.
7. **Dokumen Penawaran Resmi (Coming Soon):** Preview generator proposal resmi PDF A4 dan klausul kontrak kerja.

---

## 🎨 Desain & Tampilan

- **Palet Warna:** Dark Teal (`#0A3638`), Soft Teal (`#E8F5F3`), dan Clean White (`#FFFFFF`).
- **Tema:** Light Mode Only, dengan kontras tajam, bersih, minimalis, dan elegan.
- **Mobile Friendly:** Didesain khusus agar nyaman dan responsif di layar ponsel (375px+) maupun desktop.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI Normalization:** Google AI Studio (Gemini) dengan failover key otomatis
- **Testing:** Native Node.js Test Runner (Pure unit tests & Golden Tests A–D)

---

## 🚀 Menjalankan Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/azhardanii/freelancer-tools.git
   cd freelancer-tools
   ```

2. **Salin file environment:**
   ```bash
   cp .env.example .env.local
   ```
   Isi `GEMINI_API_KEY` dari Google AI Studio.

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Jalankan dev server:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

5. **Akses Dashboard Analytics:**
   Buka [http://localhost:3000/analytics](http://localhost:3000/analytics).

---

## 🧪 Pengujian Unit Test

```bash
node scripts/test-engine.mjs
node scripts/test-golden.mjs
node scripts/test-e2e.mjs
```

---

## 🤝 Connect with Uqi

- Website Portofolio: [https://azhardanii.github.io](https://azhardanii.github.io)
- Lab Sekolah WFA
