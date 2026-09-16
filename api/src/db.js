import 'dotenv/config'
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultPath = path.join(__dirname, '..', 'data', 'dompetku.sqlite')
const dbPath = process.env.DB_PATH
  ? path.resolve(__dirname, '..', process.env.DB_PATH)
  : defaultPath

export const db = new DatabaseSync(dbPath)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

db.exec(`
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
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
    is_paid INTEGER NOT NULL DEFAULT 0,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

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

function runInTransaction(fn) {
  db.exec('BEGIN')
  try {
    fn()
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

function seedCategoriesIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM categories').get().n
  if (count > 0) return
  const insert = db.prepare(
    'INSERT INTO categories (key, label, type, budget_limit) VALUES (@key, @label, @type, @budget_limit)'
  )
  runInTransaction(() => defaultCategories.forEach((r) => insert.run(r)))
}

function seedTransactionsIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM transactions').get().n
  if (count > 0) return

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

  const insert = db.prepare(
    'INSERT INTO transactions (id, type, category, note, amount, date) VALUES (@id, @type, @category, @note, @amount, @date)'
  )
  runInTransaction(() => sample.forEach((r) => insert.run({ id: randomUUID(), ...r })))
}

function seedBillsIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM bills').get().n
  if (count > 0) return

  const sample = [
    { name: 'Listrik PLN', amount: 350000, due_day: 5, is_paid: 0, note: 'Tagihan bulanan' },
    { name: 'Internet Rumah', amount: 250000, due_day: 10, is_paid: 0, note: null },
    { name: 'Cicilan Motor', amount: 900000, due_day: 15, is_paid: 0, note: 'Tenor 24 bulan' },
    { name: 'Langganan Streaming', amount: 54000, due_day: 20, is_paid: 1, note: null }
  ]

  const insert = db.prepare(
    'INSERT INTO bills (id, name, amount, due_day, is_paid, note) VALUES (@id, @name, @amount, @due_day, @is_paid, @note)'
  )
  runInTransaction(() => sample.forEach((r) => insert.run({ id: randomUUID(), ...r })))
}

seedCategoriesIfEmpty()
seedTransactionsIfEmpty()
seedBillsIfEmpty()