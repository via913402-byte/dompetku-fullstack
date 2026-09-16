import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { db } from '../db.js'

const router = Router()

function validatePayload(body) {
  const errors = []
  if (!body.name || typeof body.name !== 'string') {
    errors.push('Nama tagihan wajib diisi')
  }
  if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
    errors.push('Jumlah harus berupa angka lebih dari 0')
  }
  if (!body.dueDay || typeof body.dueDay !== 'number' || body.dueDay < 1 || body.dueDay > 31) {
    errors.push('Tanggal jatuh tempo harus antara 1-31')
  }
  return errors
}

// GET /api/bills - daftar semua tagihan
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM bills ORDER BY due_day ASC').all()
  res.json(rows)
})

// POST /api/bills - tambah tagihan baru
router.post('/', (req, res) => {
  const errors = validatePayload(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  const bill = {
    id: randomUUID(),
    name: req.body.name,
    amount: req.body.amount,
    due_day: req.body.dueDay,
    is_paid: 0,
    note: req.body.note || null
  }

  db.prepare(
    'INSERT INTO bills (id, name, amount, due_day, is_paid, note) VALUES (@id, @name, @amount, @due_day, @is_paid, @note)'
  ).run(bill)

  res.status(201).json(bill)
})

// PATCH /api/bills/:id - update data / tandai lunas
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM bills WHERE id = ?').get(req.params.id)
  if (!existing) {
    return res.status(404).json({ errors: ['Tagihan tidak ditemukan'] })
  }

  const updated = {
    ...existing,
    name: req.body.name ?? existing.name,
    amount: req.body.amount ?? existing.amount,
    due_day: req.body.dueDay ?? existing.due_day,
    is_paid: req.body.is_paid ?? existing.is_paid,
    note: req.body.note ?? existing.note
  }

  db.prepare(
    'UPDATE bills SET name = @name, amount = @amount, due_day = @due_day, is_paid = @is_paid, note = @note WHERE id = @id'
  ).run(updated)

  res.json(updated)
})

// DELETE /api/bills/:id - hapus tagihan
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM bills WHERE id = ?').run(req.params.id)
  if (result.changes === 0) {
    return res.status(404).json({ errors: ['Tagihan tidak ditemukan'] })
  }
  res.status(204).end()
})

export default router