<script setup>
import { computed } from 'vue'
import SummaryCard from '../components/SummaryCard.vue'
import BillsList from '../components/BillsList.vue'
import { useFinance } from '../composables/useFinance'
import { formatRupiah } from '../utils/format'

const { bills, toggleBillPaid, deleteBill } = useFinance()

const totalBills = computed(() =>
  (bills.value || []).reduce((sum, b) => sum + Number(b.amount || 0), 0)
)

const unpaidBills = computed(() =>
  (bills.value || []).filter((b) => !b.isPaid)
)

const totalUnpaid = computed(() =>
  unpaidBills.value.reduce((sum, b) => sum + Number(b.amount || 0), 0)
)
</script>

<template>
  <section class="view">
    <div class="summary-grid">
      <SummaryCard
        label="Total tanggungan bulan ini"
        :value="formatRupiah(totalBills)"
        tone="blue"
      />
      <SummaryCard
        label="Belum dibayar"
        :value="formatRupiah(totalUnpaid)"
        tone="negative"
        :detail="`${unpaidBills.length} tanggungan`"
      />
      <SummaryCard
        label="Sudah lunas"
        :value="formatRupiah(totalBills - totalUnpaid)"
        tone="positive"
      />
    </div>

    <div class="panel-block">
      <h2>Daftar Tanggungan</h2>
      <p class="hint">Tandai sebagai lunas setelah dibayar</p>
      <BillsList
        :bills="bills"
        @toggle-paid="toggleBillPaid"
        @delete="deleteBill"
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

  .panel-block {
    padding: 18px 16px;
  }
}
</style>