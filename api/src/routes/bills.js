import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { pool } from '../db.js'

const router = Router()

function getDeviceId(req) {
  return req.headers['x-device-id'] || null
}

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

// GET /api/bills
router.get('/', async (req, res) => {
  const deviceId = getDeviceId(req)
  const { rows } = await pool.query(
    'SELECT * FROM bills WHERE device_id = $1 ORDER BY due_day ASC',
    [deviceId]
  )
  res.json(rows)
})

// POST /api/bills
router.post('/', async (req, res) => {
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
    note: req.body.note || null,
    device_id: getDeviceId(req)
  }

  await pool.query(
    'INSERT INTO bills (id, name, amount, due_day, is_paid, note, device_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [bill.id, bill.name, bill.amount, bill.due_day, bill.is_paid, bill.note, bill.device_id]
  )

  res.status(201).json(bill)
})

// PATCH /api/bills/:id
router.patch('/:id', async (req, res) => {
  const deviceId = getDeviceId(req)
  const { rows } = await pool.query(
    'SELECT * FROM bills WHERE id = $1 AND device_id = $2',
    [req.params.id, deviceId]
  )
  const existing = rows[0]
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

  await pool.query(
    'UPDATE bills SET name = $1, amount = $2, due_day = $3, is_paid = $4, note = $5 WHERE id = $6',
    [updated.name, updated.amount, updated.due_day, updated.is_paid, updated.note, updated.id]
  )

  res.json(updated)
})

// DELETE /api/bills/:id
router.delete('/:id', async (req, res) => {
  const deviceId = getDeviceId(req)
  const result = await pool.query(
    'DELETE FROM bills WHERE id = $1 AND device_id = $2',
    [req.params.id, deviceId]
  )
  if (result.rowCount === 0) {
    return res.status(404).json({ errors: ['Tagihan tidak ditemukan'] })
  }
  res.status(204).end()
})

export default router