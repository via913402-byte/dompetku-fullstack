import { reactive, computed } from 'vue'
import { api } from '../api/client'

const state = reactive({
  transactions: [],
  categories: [],
  bills: [],
  loading: true,
  error: '',
  saving: false
})

async function loadAll() {
  state.loading = true
  state.error = ''
  try {
    const [categories, transactions, bills] = await Promise.all([
      api.getCategories(),
      api.getTransactions(),
      api.getBills()
    ])
    state.categories = categories
    state.transactions = transactions
    state.bills = bills
  } catch (e) {
    state.error = e.message || 'Gagal memuat data dari server'
  } finally {
    state.loading = false
  }
}

export function useFinance() {
  const transactions = computed(() =>
    [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  const totalIncome = computed(() =>
    state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const totalExpense = computed(() =>
    state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const balance = computed(() => totalIncome.value - totalExpense.value)

  const savingsRate = computed(() => {
    if (totalIncome.value === 0) return 0
    return Math.round((balance.value / totalIncome.value) * 100)
  })

  function categoryLabel(key) {
    return state.categories.find((c) => c.key === key)?.label || key
  }

  const expenseByCategory = computed(() => {
    const map = {}
    state.categories
      .filter((c) => c.type === 'expense')
      .forEach((c) => {
        map[c.key] = { ...c, total: 0 }
      })
    state.transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!map[t.category]) {
          map[t.category] = {
            key: t.category,
            label: t.category,
            type: 'expense',
            total: 0
          }
        }
        map[t.category].total += Number(t.amount)
      })
    return Object.values(map)
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
  })

  const monthlyTrend = computed(() => {
    const months = {}
    state.transactions.forEach((t) => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!months[key]) months[key] = { key, date: d, income: 0, expense: 0 }
      if (t.type === 'income') months[key].income += Number(t.amount)
      else months[key].expense += Number(t.amount)
    })
    return Object.values(months)
      .sort((a, b) => a.date - b.date)
      .slice(-6)
  })

  // ===== Transaksi =====
  async function addTransaction(payload) {
    state.saving = true
    state.error = ''
    try {
      const created = await api.createTransaction({
        type: payload.type,
        category: payload.category,
        note: payload.note,
        amount: Number(payload.amount),
        date: payload.date
      })
      state.transactions.push(created)
      return true
    } catch (e) {
      state.error = e.message || 'Gagal menyimpan transaksi'
      return false
    } finally {
      state.saving = false
    }
  }

  async function deleteTransaction(id) {
    state.error = ''
    const prev = [...state.transactions]
    state.transactions = state.transactions.filter((t) => t.id !== id)
    try {
      await api.deleteTransaction(id)
    } catch (e) {
      state.transactions = prev
      state.error = e.message || 'Gagal menghapus transaksi'
    }
  }

  // ===== Tanggungan (Bills) — sudah pakai API =====
  async function addBill(payload) {
    state.saving = true
    state.error = ''
    try {
      const created = await api.createBill({
        name: payload.name,
        amount: Number(payload.amount),
        dueDay: Number(payload.dueDay),
        note: payload.note || ''
      })
      state.bills.push(created)
      return true
    } catch (e) {
      state.error = e.message || 'Gagal menyimpan tanggungan'
      return false
    } finally {
      state.saving = false
    }
  }

  async function toggleBillPaid(id) {
    const bill = state.bills.find((b) => b.id === id)
    if (!bill) return

    const prev = bill.isPaid
    bill.isPaid = !bill.isPaid

    try {
      await api.updateBill(id, { isPaid: bill.isPaid })
    } catch (e) {
      bill.isPaid = prev
      state.error = e.message || 'Gagal mengubah status tanggungan'
    }
  }

  async function deleteBill(id) {
    state.error = ''
    const prev = [...state.bills]
    state.bills = state.bills.filter((b) => b.id !== id)

    try {
      await api.deleteBill(id)
    } catch (e) {
      state.bills = prev
      state.error = e.message || 'Gagal menghapus tanggungan'
    }
  }

  return {
    categories: computed(() => state.categories),
    transactions,
    bills: computed(() => state.bills),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    saving: computed(() => state.saving),

    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    expenseByCategory,
    monthlyTrend,
    categoryLabel,

    loadAll,
    addTransaction,
    deleteTransaction,
    addBill,
    toggleBillPaid,
    deleteBill
  }
}