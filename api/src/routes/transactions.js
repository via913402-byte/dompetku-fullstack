import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { pool } from '../db.js'

const router = Router()

function getDeviceId(req) {
  return req.headers['x-device-id'] || null
}

async function validatePayload(body) {
  const errors = []
  if (!['income', 'expense'].includes(body.type)) errors.push('type harus "income" atau "expense"')
  if (!body.category || typeof body.category !== 'string') errors.push('category wajib diisi')
  if (!(Number(body.amount) > 0)) errors.push('amount harus lebih besar dari 0')
  if (!body.date || Number.isNaN(Date.parse(body.date))) errors.push('date tidak valid')

  if (body.category) {
    const { rows } = await pool.query('SELECT key FROM categories WHERE key = $1', [body.category])
    if (rows.length === 0) errors.push(`category "${body.category}" tidak ditemukan`)
  }

  return errors
}

// GET /api/transactions
router.get('/', async (req, res) => {
  const deviceId = getDeviceId(req)
  const { rows } = await pool.query(
    'SELECT * FROM transactions WHERE device_id = $1 ORDER BY date DESC, created_at DESC',
    [deviceId]
  )
  res.json(rows)
})

// POST /api/transactions
router.post('/', async (req, res) => {
  const errors = await validatePayload(req.body)
  if (errors.length) return res.status(400).json({ errors })

  const row = {
    id: randomUUID(),
    type: req.body.type,
    category: req.body.category,
    note: (req.body.note || '').trim(),
    amount: Math.round(Number(req.body.amount)),
    date: req.body.date,
    device_id: getDeviceId(req)
  }

  await pool.query(
    'INSERT INTO transactions (id, type, category, note, amount, date, device_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [row.id, row.type, row.category, row.note, row.amount, row.date, row.device_id]
  )

  const { rows } = await pool.query('SELECT * FROM transactions WHERE id = $1', [row.id])
  res.status(201).json(rows[0])
})

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  const deviceId = getDeviceId(req)
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND device_id = $2',
    [req.params.id, deviceId]
  )
  if (result.rowCount === 0) return res.status(404).json({ errors: ['Transaksi tidak ditemukan'] })
  res.status(204).send()
})

export default router