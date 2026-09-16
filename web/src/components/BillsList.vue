<script setup>
import { formatRupiah } from '../utils/format'

defineProps({
  bills: { type: Array, required: true } // [{ id, name, amount, dueDay, isPaid, note }]
})

defineEmits(['toggle-paid', 'delete'])
</script>

<template>
  <div class="bills">
    <!-- Empty state -->
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
          <th></th>
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
          <td class="right">
            <button class="del" @click="$emit('delete', bill.id)" aria-label="Hapus">✕</button>
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
          <button class="del" @click="$emit('delete', bill.id)">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bills {
  width: 100%;
}

.empty {
  text-align: center;
  color: var(--ink-soft);
  padding: 36px 16px;
  font-size: 14px;
}

/* ===== Desktop Table ===== */
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

th.right, td.right {
  text-align: right;
}

tbody td {
  padding: 14px 10px;
  border-bottom: 1px solid var(--line-soft);
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

.bill-name {
  font-weight: 500;
  color: var(--ink);
}

.bill-note {
  font-size: 12px;
  color: var(--ink-soft);
  margin-top: 2px;
}

.muted {
  color: var(--ink-soft);
}

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

.bill-actions .del {
  font-size: 12.5px;
  color: var(--negative);
  background: rgba(239, 68, 68, 0.08);
  padding: 9px 14px;
  border-radius: 8px;
}

/* Visibility */
.desktop-only { display: table; }
.mobile-only { display: none; }

@media (max-width: 700px) {
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
}
</style>