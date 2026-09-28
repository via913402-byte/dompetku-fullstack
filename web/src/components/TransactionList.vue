<script setup>
import { formatDate, formatRupiah } from '../utils/format'

defineProps({
  transactions: { type: Array, required: true },
  categoryLabel: { type: Function, required: true },
  compact: { type: Boolean, default: false }
})

defineEmits(['delete', 'edit'])
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
        <th v-if="!compact" class="actions-col"></th>
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
        <td v-if="!compact" class="actions">
          <button class="icon-btn" @click="$emit('edit', t)" aria-label="Edit transaksi" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="icon-btn danger" @click="$emit('delete', t.id)" aria-label="Hapus transaksi" title="Hapus">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
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

    <div v-for="t in transactions" :key="t.id" class="tx-card">
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

      <div v-if="!compact" class="tx-actions">
        <button class="icon-btn" @click="$emit('edit', t)" aria-label="Edit" title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="icon-btn danger" @click="$emit('delete', t.id)" aria-label="Hapus" title="Hapus">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
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

th.right, td.right { text-align: right; }

.actions-col { width: 90px; }

tbody td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--line-soft);
  vertical-align: middle;
}

tbody tr:last-child td { border-bottom: none; }

.muted { color: var(--ink-soft); }
.pos { color: var(--positive); }
.neg { color: var(--negative); }

.empty {
  text-align: center;
  color: var(--ink-soft);
  padding: 28px 10px;
  font-size: 13.5px;
}

.actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

/* ===== Icon Buttons ===== */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--ink-soft);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-btn:hover {
  background: var(--line-soft);
  color: var(--ink);
}

.icon-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--negative);
}

/* ===== Mobile Cards ===== */
.tx-cards {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tx-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line-soft);
}

.tx-card:last-child { border-bottom: none; }

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

.tx-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

/* Visibility */
.desktop-only { display: table; }
.mobile-only { display: none; }

@media (max-width: 700px) {
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
}
</style>