<script setup>
import { computed, unref } from 'vue'
import TransactionList from '../components/TransactionList.vue'
import SearchInput from '../components/SearchInput.vue'
import { useFinance } from '../composables/useFinance'
import { useSearch } from '../composables/useSearch'

const { transactions, categoryLabel, deleteTransaction } = useFinance()

// [BARU] teks tambahan yang ikut dicari: nama kategori dan jenis transaksi
function teksTambahan(t) {
  const bagian = []
  const kategori = t.category ?? t.categoryId ?? t.category_id
  if (kategori !== undefined && kategori !== null) bagian.push(categoryLabel(kategori))
  const jenis = String(t.type || '').toLowerCase()
  if (['income', 'pemasukan', 'masuk'].includes(jenis)) bagian.push('pemasukan')
  if (['expense', 'pengeluaran', 'keluar'].includes(jenis)) bagian.push('pengeluaran')
  return bagian.join(' ')
}

const { query, hasil, aktif } = useSearch(transactions, teksTambahan)
const total = computed(() => (unref(transactions) || []).length)
</script>

<template>
  <section class="view">
    <div class="panel-block">
      <!-- [BARU] pencarian (selalu tampil) -->
      <div class="toolbar">
        <SearchInput
          v-model="query"
          placeholder="Cari deskripsi, kategori, atau nominal"
          label="Cari transaksi"
        />
        <p v-if="aktif" class="result-count">{{ hasil.length }} dari {{ total }} transaksi</p>
      </div>

      <p v-if="aktif && hasil.length === 0" class="no-result">
        Tidak ada transaksi yang cocok dengan “{{ query }}”.
      </p>

      <TransactionList
        v-else
        :transactions="hasil"
        :category-label="categoryLabel"
        @delete="deleteTransaction"
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

.panel-block {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 22px 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.toolbar :deep(.search) {
  max-width: 420px;
}

.result-count {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink-soft);
  white-space: nowrap;
}

.no-result {
  margin: 0;
  padding: 28px 0 12px;
  text-align: center;
  font-size: 14px;
  color: var(--ink-soft);
}

@media (max-width: 960px) {
  .panel-block {
    padding: 18px 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 14px;
  }

  .toolbar :deep(.search) {
    max-width: none;
  }
}
</style>