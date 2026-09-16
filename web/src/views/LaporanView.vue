<script setup>
import { ref, computed } from 'vue'
import SummaryCard from '../components/SummaryCard.vue'
import CategoryBars from '../components/CategoryBars.vue'
import TransactionList from '../components/TransactionList.vue'
import { useFinance } from '../composables/useFinance'
import { formatRupiah } from '../utils/format'

const { transactions, categoryLabel } = useFinance()

// Bulan yang sedang dipilih (default: bulan ini)
const now = new Date()
const selectedMonth = ref(
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
)

// Daftar semua bulan yang punya transaksi + bulan ini
const availableMonths = computed(() => {
  const set = new Set()
  transactions.value.forEach((t) => {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    set.add(key)
  })
  // Pastikan bulan ini selalu ada
  set.add(selectedMonth.value)
  return Array.from(set).sort().reverse() // terbaru di atas
})

function formatMonthName(key) {
  const [year, month] = key.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

// Transaksi di bulan yang dipilih
const monthTransactions = computed(() =>
  transactions.value.filter((t) => {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return key === selectedMonth.value
  })
)

const monthIncome = computed(() =>
  monthTransactions.value
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
)

const monthExpense = computed(() =>
  monthTransactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
)

const monthBalance = computed(() => monthIncome.value - monthExpense.value)

// Pengeluaran per kategori di bulan ini
const monthExpenseByCategory = computed(() => {
  const map = {}
  monthTransactions.value
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!map[t.category]) {
        map[t.category] = {
          key: t.category,
          label: categoryLabel(t.category),
          total: 0,
          limit: null
        }
      }
      map[t.category].total += t.amount
    })
  return Object.values(map).sort((a, b) => b.total - a.total)
})

function prevMonth() {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function nextMonth() {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m, 1)
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
</script>

<template>
  <section class="view">
    <!-- Pilih Bulan -->
    <div class="month-nav">
      <button class="nav-btn" @click="prevMonth" aria-label="Bulan sebelumnya">
        ‹
      </button>

      <div class="month-select">
        <select v-model="selectedMonth">
          <option
            v-for="m in availableMonths"
            :key="m"
            :value="m"
          >
            {{ formatMonthName(m) }}
          </option>
        </select>
      </div>

      <button class="nav-btn" @click="nextMonth" aria-label="Bulan berikutnya">
        ›
      </button>
    </div>

    <!-- Ringkasan Bulan -->
    <div class="summary-grid">
      <SummaryCard
        label="Pemasukan"
        :value="formatRupiah(monthIncome)"
        tone="positive"
      />
      <SummaryCard
        label="Pengeluaran"
        :value="formatRupiah(monthExpense)"
        tone="negative"
      />
      <SummaryCard
        label="Saldo bulan ini"
        :value="formatRupiah(monthBalance)"
        :tone="monthBalance >= 0 ? 'blue' : 'negative'"
      />
    </div>

    <!-- Pengeluaran per Kategori -->
    <div class="panel-block">
      <h2>Pengeluaran per kategori</h2>
      <p class="hint">{{ formatMonthName(selectedMonth) }}</p>

      <div v-if="monthExpenseByCategory.length === 0" class="empty">
        Belum ada pengeluaran di bulan ini.
      </div>
      <CategoryBars v-else :categories="monthExpenseByCategory" />
    </div>

    <!-- Daftar Transaksi Bulan Ini -->
    <div class="panel-block">
      <h2>Transaksi bulan ini</h2>
      <p class="hint">{{ monthTransactions.length }} transaksi</p>

      <TransactionList
        :transactions="monthTransactions"
        :category-label="categoryLabel"
        compact
      />
    </div>
  </section>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== Month Navigation ===== */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 12px 16px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  background: var(--paper);
  border-radius: 8px;
  font-size: 20px;
  color: var(--ink);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.nav-btn:hover {
  background: var(--line-soft);
  border-color: var(--blue);
}

.month-select {
  flex: 1;
  max-width: 220px;
}

.month-select select {
  width: 100%;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
  text-align: center;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.month-select select:focus {
  border-color: var(--blue);
  outline: none;
}

/* ===== Summary ===== */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ===== Panels ===== */
.panel-block {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 22px 24px;
}

.panel-block h2 {
  font-size: 15px;
  margin: 0;
}

.hint {
  margin: 4px 0 18px;
  font-size: 12.5px;
  color: var(--ink-soft);
}

.empty {
  text-align: center;
  color: var(--ink-soft);
  padding: 24px 0;
  font-size: 14px;
}

/* ===== Mobile ===== */
@media (max-width: 960px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .panel-block {
    padding: 18px 16px;
  }

  .month-nav {
    padding: 10px 12px;
  }

  .month-select {
    max-width: none;
  }
}
</style>