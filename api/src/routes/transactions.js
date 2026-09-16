import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { db } from '../db.js'

const router = Router()

function validatePayload(body) {
  const errors = []
  if (!['income', 'expense'].includes(body.type)) errors.push('type harus "income" atau "expense"')
  if (!body.category || typeof body.category !== 'string') errors.push('category wajib diisi')
  if (!(Number(body.amount) > 0)) errors.push('amount harus lebih besar dari 0')
  if (!body.date || Number.isNaN(Date.parse(body.date))) errors.push('date tidak valid')

  if (body.category) {
    const cat = db.prepare('SELECT key FROM categories WHERE key = ?').get(body.category)
    if (!cat) errors.push(`category "${body.category}" tidak ditemukan`)
  }

  return errors
}

// GET /api/transactions
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM transactions ORDER BY date DESC, created_at DESC').all()
  res.json(rows)
})

// POST /api/transactions
router.post('/', (req, res) => {
  const errors = validatePayload(req.body)
  if (errors.length) return res.status(400).json({ errors })

  const row = {
    id: randomUUID(),
    type: req.body.type,
    category: req.body.category,
    note: (req.body.note || '').trim(),
    amount: Math.round(Number(req.body.amount)),
    date: req.body.date
  }

  db.prepare(
    'INSERT INTO transactions (id, type, category, note, amount, date) VALUES (@id, @type, @category, @note, @amount, @date)'
  ).run(row)

  const saved = db.prepare('SELECT * FROM transactions WHERE id = ?').get(row.id)
  res.status(201).json(saved)
})

// DELETE /api/transactions/:id
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ errors: ['Transaksi tidak ditemukan'] })
  res.status(204).send()
})

export default router
