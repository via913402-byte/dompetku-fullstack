<script setup>
import SummaryCard from '../components/SummaryCard.vue'
import TrendChart from '../components/TrendChart.vue'
import CategoryBars from '../components/CategoryBars.vue'
import TransactionList from '../components/TransactionList.vue'
import { useFinance } from '../composables/useFinance'
import { formatRupiah } from '../utils/format'

const {
  balance,
  savingsRate,
  totalIncome,
  totalExpense,
  monthlyTrend,
  expenseByCategory,
  transactions,
  categoryLabel
} = useFinance()
</script>

<template>
  <section class="view">
    <div class="summary-grid">
      <SummaryCard
        label="Saldo saat ini"
        :value="formatRupiah(balance)"
        tone="blue"
        :detail="`Tingkat tabungan ${savingsRate}%`"
      />
      <SummaryCard
        label="Total pemasukan"
        :value="formatRupiah(totalIncome)"
        tone="positive"
      />
      <SummaryCard
        label="Total pengeluaran"
        :value="formatRupiah(totalExpense)"
        tone="negative"
      />
    </div>

    <div class="split">
      <div class="panel-block">
        <h2>Pemasukan vs pengeluaran</h2>
        <p class="hint">6 bulan terakhir</p>
        <TrendChart :months="monthlyTrend" />
      </div>
      <div class="panel-block">
        <h2>Pengeluaran per kategori</h2>
        <p class="hint">Terhadap batas anggaran bulanan</p>
        <CategoryBars :categories="expenseByCategory.slice(0, 5)" />
      </div>
    </div>

    <div class="panel-block">
      <h2>Transaksi terbaru</h2>
      <TransactionList
        :transactions="transactions.slice(0, 6)"
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.split {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
}

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

@media (max-width: 960px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .split {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .panel-block {
    padding: 18px 16px;
  }
}
</style>