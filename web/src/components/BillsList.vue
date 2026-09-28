<script setup>
import { formatRupiah } from '../utils/format'

defineProps({
  bills: { type: Array, required: true }
})

defineEmits(['toggle-paid', 'delete', 'edit'])
</script>

<template>
  <div class="bills">
    <div v-if="!bills.length" class="empty">
      Belum ada tagihan. Tambahkan angsuran HP, listrik, internet, dll.
    </div>

    <!-- Desktop table -->
    <table class="bills-table desktop-only">
      <thead>
        <tr>
          <th>Nama Tagihan</th>
          <th>Jatuh Tempo</th>
          <th class="right">Jumlah</th>
          <th>Status</th>
          <th class="actions-col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bill in bills" :key="bill.id">
          <td>
            <div class="bill-name">{{ bill.name }}</div>
            <div v-if="bill.note" class="bill-note">{{ bill.note }}</div>
          </td>
          <td class="muted">Tanggal {{ bill.dueDay }}</td>
          <td class="right mono">{{ formatRupiah(bill.amount) }}</td>
          <td>
            <button
              class="status"
              :class="bill.isPaid ? 'paid' : 'unpaid'"
              @click="$emit('toggle-paid', bill.id)"
            >
              {{ bill.isPaid ? 'Lunas' : 'Belum' }}
            </button>
          </td>
          <td class="actions">
            <button class="icon-btn" @click="$emit('edit', bill)" aria-label="Edit" title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="icon-btn danger" @click="$emit('delete', bill.id)" aria-label="Hapus" title="Hapus">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile cards -->
    <div class="bills-cards mobile-only">
      <div v-for="bill in bills" :key="bill.id" class="bill-card">
        <div class="bill-top">
          <div class="bill-info">
            <span class="bill-name">{{ bill.name }}</span>
            <span class="bill-meta">Jatuh tempo tanggal {{ bill.dueDay }}</span>
            <span v-if="bill.note" class="bill-note">{{ bill.note }}</span>
          </div>
          <div class="bill-amount mono">{{ formatRupiah(bill.amount) }}</div>
        </div>

        <div class="bill-actions">
          <button
            class="status"
            :class="bill.isPaid ? 'paid' : 'unpaid'"
            @click="$emit('toggle-paid', bill.id)"
          >
            {{ bill.isPaid ? '✓ Lunas' : 'Belum bayar' }}
          </button>

          <div class="icon-group">
            <button class="icon-btn" @click="$emit('edit', bill)" aria-label="Edit" title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="icon-btn danger" @click="$emit('delete', bill.id)" aria-label="Hapus" title="Hapus">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bills { width: 100%; }

.empty {
  text-align: center;
  color: var(--ink-soft);
  padding: 36px 16px;
  font-size: 14px;
}

/* Desktop Table */
.bills-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

thead th {
  text-align: left;
  font-size: 11.5px;
  color: var(--ink-soft);
  font-weight: 500;
  padding: 0 10px 10px;
  border-bottom: 1px solid var(--line);
}

th.right, td.right { text-align: right; }
.actions-col { width: 90px; }

tbody td {
  padding: 14px 10px;
  border-bottom: 1px solid var(--line-soft);
  vertical-align: middle;
}

tbody tr:last-child td { border-bottom: none; }

.bill-name { font-weight: 500; color: var(--ink); }
.bill-note { font-size: 12px; color: var(--ink-soft); margin-top: 2px; }
.muted { color: var(--ink-soft); }

.status {
  border: none;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.status.paid {
  background: rgba(34, 197, 94, 0.12);
  color: var(--positive);
}

.status.unpaid {
  background: rgba(239, 68, 68, 0.1);
  color: var(--negative);
}

.actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

/* Icon Buttons */
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

/* Mobile Cards */
.bills-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bill-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bill-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.bill-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.bill-meta {
  font-size: 12.5px;
  color: var(--ink-soft);
}

.bill-amount {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.bill-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.bill-actions .status {
  flex: 1;
  padding: 9px 12px;
  font-size: 13px;
}

.icon-group {
  display: flex;
  gap: 2px;
}

/* Visibility */
.desktop-only { display: table; }
.mobile-only { display: none; }

@media (max-width: 700px) {
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
}
</style>