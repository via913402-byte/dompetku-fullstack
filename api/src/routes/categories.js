import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

// GET /api/categories
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, label, type, budget_limit AS limit_ FROM categories ORDER BY type, label').all()
  const categories = rows.map((r) => ({
    key: r.key,
    label: r.label,
    type: r.type,
    limit: r.limit_ || 0
  }))
  res.json(categories)
})

export default router
