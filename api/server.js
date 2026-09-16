import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import transactionsRouter from './src/routes/transactions.js'
import categoriesRouter from './src/routes/categories.js'
import billsRouter from './src/routes/bills.js'
import './src/db.js' // memastikan database & tabel siap sebelum server jalan

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/transactions', transactionsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/bills', billsRouter)

app.use((req, res) => {
  res.status(404).json({ errors: ['Rute tidak ditemukan'] })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ errors: ['Terjadi kesalahan pada server'] })
})

app.listen(PORT, () => {
  console.log(`Dompetku API berjalan di http://localhost:${PORT}`)
})