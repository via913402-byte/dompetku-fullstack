// Alamat backend API. Default-nya langsung ke localhost:4000 — tidak perlu file .env.
// Kalau backend dipindah ke alamat lain (misal saat deploy), tinggal ganti baris di bawah ini.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!res.ok) {
    let errors = ['Terjadi kesalahan saat menghubungi server']
    try {
      const body = await res.json()
      if (body.errors) errors = body.errors
      else if (body.message) errors = [body.message]
    } catch {
      // respons bukan JSON, pakai pesan default
    }
    throw new Error(errors.join(', '))
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // ===== Categories =====
  getCategories: () => request('/categories'),

  // ===== Transactions =====
  getTransactions: () => request('/transactions'),
  createTransaction: (payload) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  deleteTransaction: (id) =>
    request(`/transactions/${id}`, { method: 'DELETE' }),

  // ===== Bills (Tanggungan) =====
  getBills: () => request('/bills'),

  createBill: (payload) =>
    request('/bills', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateBill: (id, payload) =>
    request(`/bills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  deleteBill: (id) =>
    request(`/bills/${id}`, { method: 'DELETE' })
}