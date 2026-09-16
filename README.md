# Dompetku — Dashboard Manajemen Keuangan (Full-stack)

Aplikasi manajemen keuangan pribadi dengan dua bagian terpisah yang saling terhubung:

- **`api/`** — backend Express + database SQLite asli (file `.sqlite`, bukan localStorage), memakai modul `node:sqlite` bawaan Node.js — **tidak ada dependency native yang perlu di-compile**. Menyimpan transaksi & kategori secara permanen di server.
- **`web/`** — frontend Vue 3 + Vite, tema hitam/putih/biru, mengambil dan menyimpan data lewat API di atas.

```
dompetku-fullstack/
├── api/                  → backend (Express + SQLite)
│   ├── server.js
│   ├── src/
│   │   ├── db.js         → koneksi, skema tabel, seed data awal
│   │   └── routes/
│   │       ├── transactions.js
│   │       └── categories.js
│   ├── data/              → file database .sqlite dibuat otomatis di sini
│   ├── .env.example
│   └── package.json
│
├── web/                  → frontend (Vue 3 + Vite)
│   ├── src/
│   │   ├── api/client.js  → pemanggil REST API
│   │   ├── components/
│   │   ├── composables/useFinance.js
│   │   └── App.vue
│   └── package.json
│
├── package.json          → skrip gabungan (jalankan api + web sekaligus)
└── README.md
```

## 1. Prasyarat

- **Node.js versi 22.5 ke atas** (dibutuhkan untuk modul `node:sqlite` bawaan Node)
- npm (sudah ikut terpasang bersama Node.js)

Tidak perlu instal database terpisah, dan tidak perlu Visual Studio Build Tools / Python — SQLite berupa file biasa yang otomatis dibuat oleh backend saat pertama kali dijalankan, tanpa proses compile native apa pun.

## 2. Instalasi

Dari folder root (`dompetku-fullstack/`), jalankan sekali saja:

```bash
npm run install:all
```

Perintah ini akan meng-install dependency di `api/` dan `web/` sekaligus.

Kalau mau manual per folder:

```bash
cd api && npm install
cd ../web && npm install
```

## 3. Konfigurasi environment

Hanya `api/` yang butuh file `.env` (untuk port server & lokasi database). Salin dari contohnya:

```bash
# di dalam folder api/
cp .env.example .env
```

Isi `api/.env`:
- `PORT=4000` → port server backend
- `DB_PATH=data/dompetku.sqlite` → lokasi file database

Ubah nilainya kalau port 4000 sudah dipakai proses lain.

`web/` **tidak perlu** file `.env` — alamat backend (`http://localhost:4000/api`) sudah langsung diatur di `web/src/api/client.js`. Kalau nanti backend-nya pindah alamat (misal saat deploy), tinggal ubah baris `BASE_URL` di file itu.

## 4. Menjalankan aplikasi

**Cara termudah — dari folder root**, jalankan API dan web sekaligus dalam satu perintah:

```bash
npm run dev
```

Backend akan aktif di `http://localhost:4000` dan frontend di `http://localhost:5173`.

**Cara manual — dua terminal terpisah:**

```bash
# Terminal 1 — backend
cd api
npm run dev

# Terminal 2 — frontend
cd web
npm run dev
```

Buka `http://localhost:5173` di browser.

## 5. Database

- File database tersimpan di `api/data/dompetku.sqlite`, dibuat otomatis saat server pertama kali jalan.
- Saat kosong, backend otomatis mengisi kategori default dan beberapa transaksi contoh supaya dashboard langsung terlihat terisi.
- Untuk mulai dari nol, hentikan server lalu hapus file `api/data/dompetku.sqlite*`, kemudian jalankan ulang `npm run dev` di `api/`.
- Untuk melihat isi database langsung, bisa pakai tool seperti [DB Browser for SQLite](https://sqlitebrowser.org/) dan buka file tersebut.

## 6. Endpoint API

| Method | Endpoint                  | Keterangan                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/api/health`              | Cek status server                    |
| GET    | `/api/categories`          | Daftar kategori & batas anggaran     |
| GET    | `/api/transactions`        | Semua transaksi                      |
| POST   | `/api/transactions`        | Tambah transaksi baru                |
| DELETE | `/api/transactions/:id`    | Hapus satu transaksi                 |

Contoh body `POST /api/transactions`:

```json
{
  "type": "expense",
  "category": "makanan",
  "note": "Makan siang",
  "amount": 35000,
  "date": "2026-09-15"
}
```

## 7. Build untuk produksi

```bash
cd web
npm run build
```

Hasil build statis ada di `web/dist/`, siap di-deploy ke hosting statis mana pun. Backend (`api/`) dijalankan terpisah sebagai proses Node.js biasa (`npm start`) di server/VPS, lalu ubah `BASE_URL` di `web/src/api/client.js` ke alamat backend yang sudah online sebelum build.

## 8. Menyesuaikan

- **Kategori & batas anggaran default**: edit array `defaultCategories` di `api/src/db.js`.
- **Data contoh awal**: fungsi `seedTransactionsIfEmpty()` di file yang sama.
- **Warna tema**: variabel CSS di `web/src/style.css` (`--ink`, `--paper`, `--blue`, dst).
