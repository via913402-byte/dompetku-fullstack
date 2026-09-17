import 'dotenv/config'
import pg from 'pg'
import { randomUUID } from 'node:crypto'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      budget_limit INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      category TEXT NOT NULL REFERENCES categories(key),
      note TEXT,
      amount INTEGER NOT NULL CHECK (amount > 0),
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
    );

    CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount INTEGER NOT NULL CHECK (amount > 0),
      due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
      is_paid INTEGER NOT NULL DEFAULT 0,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
    );
  `)

  await seedCategoriesIfEmpty()
  await seedTransactionsIfEmpty()
  await seedBillsIfEmpty()
}

const defaultCategories = [
  { key: 'gaji', label: 'Gaji', type: 'income', budget_limit: 0 },
  { key: 'freelance', label: 'Freelance', type: 'income', budget_limit: 0 },
  { key: 'lainnya-masuk', label: 'Lainnya', type: 'income', budget_limit: 0 },
  { key: 'makanan', label: 'Makanan & Minuman', type: 'expense', budget_limit: 1500000 },
  { key: 'transportasi', label: 'Transportasi', type: 'expense', budget_limit: 600000 },
  { key: 'tagihan', label: 'Tagihan & Utilitas', type: 'expense', budget_limit: 900000 },
  { key: 'hiburan', label: 'Hiburan', type: 'expense', budget_limit: 400000 },
  { key: 'belanja', label: 'Belanja', type: 'expense', budget_limit: 700000 },
  { key: 'lainnya-keluar', label: 'Lainnya', type: 'expense', budget_limit: 300000 }
]

async function seedCategoriesIfEmpty() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM categories')
  if (rows[0].n > 0) return
  for (const c of defaultCategories) {
    await pool.query(
      'INSERT INTO categories (key, label, type, budget_limit) VALUES ($1, $2, $3, $4)',
      [c.key, c.label, c.type, c.budget_limit]
    )
  }
}

async function seedTransactionsIfEmpty() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM transactions')
  if (rows[0].n > 0) return

  const today = new Date()
  const iso = (offsetDays) => {
    const d = new Date(today)
    d.setDate(d.getDate() - offsetDays)
    return d.toISOString().slice(0, 10)
  }

  const sample = [
    { type: 'income', category: 'gaji', note: 'Gaji bulanan', amount: 8500000, date: iso(2) },
    { type: 'income', category: 'freelance', note: 'Proyek desain logo', amount: 1200000, date: iso(6) },
    { type: 'expense', category: 'makanan', note: 'Belanja bulanan', amount: 620000, date: iso(1) },
    { type: 'expense', category: 'tagihan', note: 'Listrik & internet', amount: 480000, date: iso(3) },
    { type: 'expense', category: 'transportasi', note: 'Bensin & tol', amount: 250000, date: iso(4) },
    { type: 'expense', category: 'hiburan', note: 'Langganan streaming', amount: 120000, date: iso(8) },
    { type: 'expense', category: 'belanja', note: 'Sepatu baru', amount: 450000, date: iso(10) },
    { type: 'expense', category: 'makanan', note: 'Makan di luar', amount: 180000, date: iso(12) },
    { type: 'income', category: 'lainnya-masuk', note: 'Cashback e-wallet', amount: 75000, date: iso(15) },
    { type: 'expense', category: 'tagihan', note: 'Pulsa & paket data', amount: 100000, date: iso(20) },
    { type: 'expense', category: 'makanan', note: 'Kopi & ngopi bareng', amount: 95000, date: iso(35) },
    { type: 'expense', category: 'transportasi', note: 'Ojek online', amount: 140000, date: iso(40) },
    { type: 'income', category: 'gaji', note: 'Gaji bulan lalu', amount: 8500000, date: iso(33) }
  ]

  for (const t of sample) {
    await pool.query(
      'INSERT INTO transactions (id, type, category, note, amount, date) VALUES ($1, $2, $3, $4, $5, $6)',
      [randomUUID(), t.type, t.category, t.note, t.amount, t.date]
    )
  }
}

async function seedBillsIfEmpty() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM bills')
  if (rows[0].n > 0) return

  const sample = [
    { name: 'Listrik PLN', amount: 350000, due_day: 5, is_paid: 0, note: 'Tagihan bulanan' },
    { name: 'Internet Rumah', amount: 250000, due_day: 10, is_paid: 0, note: null },
    { name: 'Cicilan Motor', amount: 900000, due_day: 15, is_paid: 0, note: 'Tenor 24 bulan' },
    { name: 'Langganan Streaming', amount: 54000, due_day: 20, is_paid: 1, note: null }
  ]

  for (const b of sample) {
    await pool.query(
      'INSERT INTO bills (id, name, amount, due_day, is_paid, note) VALUES ($1, $2, $3, $4, $5, $6)',
      [randomUUID(), b.name, b.amount, b.due_day, b.is_paid, b.note]
    )
  }
}

await init()