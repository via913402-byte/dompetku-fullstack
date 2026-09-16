<script setup>
import { formatDate, formatRupiah } from '../utils/format'

defineProps({
  transactions: { type: Array, required: true },
  categoryLabel: { type: Function, required: true },
  compact: { type: Boolean, default: false }
})

defineEmits(['delete'])
</script>

<template>
  <!-- Desktop Table -->
  <table class="tx-table desktop-only">
    <thead>
      <tr>
        <th>Tanggal</th>
        <th>Keterangan</th>
        <th>Kategori</th>
        <th class="right">Jumlah</th>
        <th v-if="!compact"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!transactions.length">
        <td :colspan="compact ? 4 : 5" class="empty">
          Belum ada transaksi. Tambahkan yang pertama.
        </td>
      </tr>
      <tr v-for="t in transactions" :key="t.id">
        <td class="mono muted">{{ formatDate(t.date) }}</td>
        <td>{{ t.note || '—' }}</td>
        <td class="muted">{{ categoryLabel(t.category) }}</td>
        <td class="right mono" :class="t.type === 'income' ? 'pos' : 'neg'">
          {{ t.type === 'income' ? '+' : '−' }}{{ formatRupiah(t.amount) }}
        </td>
        <td v-if="!compact" class="right">
          <button
            class="del"
            @click="$emit('delete', t.id)"
            aria-label="Hapus transaksi"
          >
            ✕
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Mobile Card List -->
  <div class="tx-cards mobile-only">
    <div v-if="!transactions.length" class="empty">
      Belum ada transaksi. Tambahkan yang pertama.
    </div>

    <div
      v-for="t in transactions"
      :key="t.id"
      class="tx-card"
    >
      <div class="tx-main">
        <div class="tx-info">
          <span class="tx-note">{{ t.note || 'Tanpa keterangan' }}</span>
          <span class="tx-meta">
            {{ formatDate(t.date) }} · {{ categoryLabel(t.category) }}
          </span>
        </div>

        <div class="tx-amount mono" :class="t.type === 'income' ? 'pos' : 'neg'">
          {{ t.type === 'income' ? '+' : '−' }}{{ formatRupiah(t.amount) }}
        </div>
      </div>

      <button
        v-if="!compact"
        class="del"
        @click="$emit('delete', t.id)"
        aria-label="Hapus transaksi"
      >
        Hapus
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ===== Desktop Table ===== */
.tx-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

thead th {
  text-align: left;
  font-size: 11.5px;
  color: var(--ink-soft);
  font-weight: 500;
  padding: 0 10px 10px 10px;
  border-bottom: 1px solid var(--line);
}

th.right,
td.right {
  text-align: right;
}

tbody td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--line-soft);
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

.muted {
  color: var(--ink-soft);
}

.pos {
  color: var(--positive);
}

.neg {
  color: var(--negative);
}

.empty {
  text-align: center;
  color: var(--ink-soft);
  padding: 28px 10px;
  font-size: 13.5px;
}

.del {
  background: transparent;
  border: none;
  color: var(--ink-soft);
  cursor: pointer;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
}

.del:hover {
  background: var(--line-soft);
  color: var(--negative);
}

/* ===== Mobile Cards ===== */
.tx-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tx-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line-soft);
}

.tx-card:last-child {
  border-bottom: none;
}

.tx-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.tx-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.tx-note {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tx-meta {
  font-size: 12px;
  color: var(--ink-soft);
}

.tx-amount {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.tx-cards .del {
  font-size: 12px;
  color: var(--negative);
  padding: 6px 10px;
  background: rgba(220, 53, 69, 0.08);
  border-radius: 6px;
  flex-shrink: 0;
}

.tx-cards .del:hover {
  background: rgba(220, 53, 69, 0.15);
}

/* ===== Visibility Control ===== */
.desktop-only {
  display: table;
}

.mobile-only {
  display: none;
}

@media (max-width: 700px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }
}
</style>