<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import AddTransactionPanel from './components/AddTransactionPanel.vue'
import AddBillPanel from './components/AddBillPanel.vue'
import RingkasanView from './views/RingkasanView.vue'
import TransaksiView from './views/TransaksiView.vue'
import LaporanView from './views/LaporanView.vue'
import TanggunganView from './views/TanggunganView.vue'
import { useFinance } from './composables/useFinance'

const {
  categories,
  loading,
  error,
  saving,
  loadAll,
  addTransaction,
  addBill
} = useFinance()

const view = ref('ringkasan')
const panelOpen = ref(false)
const billPanelOpen = ref(false)
const sidebarOpen = ref(false)

onMounted(loadAll)

async function handleSubmit(payload) {
  const ok = await addTransaction(payload)
  if (ok) panelOpen.value = false
}

async function handleBillSubmit(payload) {
  const ok = await addBill(payload)
  if (ok) billPanelOpen.value = false
}

function handleNavigate(key) {
  view.value = key
  sidebarOpen.value = false
}

const pageTitle = computed(() => {
  const map = {
    ringkasan: 'Ringkasan Keuangan',
    transaksi: 'Semua Transaksi',
    tanggungan: 'Tanggungan Bulanan',
    laporan: 'Laporan Bulanan'
  }
  return map[view.value] || 'Dompetku'
})

const pageSub = computed(() => {
  if (view.value === 'tanggungan') {
    return 'Kelola angsuran, cicilan & tagihan rutin bulananmu.'
  }
  if (view.value === 'laporan') {
    return 'Lihat ringkasan pemasukan & pengeluaran per bulan.'
  }
  return 'Pantau arus kas pribadimu dalam satu tampilan.'
})
</script>

<template>
  <div class="layout">
    <button class="hamburger" @click="sidebarOpen = true" aria-label="Buka menu">
      <span></span><span></span><span></span>
    </button>

    <Sidebar
      :active="view"
      :open="sidebarOpen"
      @navigate="handleNavigate"
      @close="sidebarOpen = false"
    />

    <main class="content">
      <header class="topbar">
        <div class="topbar-text">
          <h1>{{ pageTitle }}</h1>
          <p class="sub">{{ pageSub }}</p>
        </div>

        <button
          v-if="view === 'tanggungan'"
          class="add-btn"
          @click="billPanelOpen = true"
          :disabled="loading"
        >
          + Tanggungan baru
        </button>
        <button
          v-else-if="view !== 'laporan'"
          class="add-btn"
          @click="panelOpen = true"
          :disabled="loading"
        >
          + Transaksi baru
        </button>
      </header>

      <div v-if="error" class="banner error">
        {{ error }}
        <button class="retry" @click="loadAll">Coba lagi</button>
      </div>

      <div v-if="loading" class="loading-state">Memuat data dari server…</div>

      <template v-else>
        <RingkasanView v-if="view === 'ringkasan'" />
        <TransaksiView v-else-if="view === 'transaksi'" />
        <TanggunganView v-else-if="view === 'tanggungan'" />
        <LaporanView v-else-if="view === 'laporan'" />
      </template>
    </main>

    <AddTransactionPanel
      :open="panelOpen"
      :categories="categories"
      :saving="saving"
      @close="panelOpen = false"
      @submit="handleSubmit"
    />

    <AddBillPanel
      :open="billPanelOpen"
      :saving="saving"
      @close="billPanelOpen = false"
      @submit="handleBillSubmit"
    />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.hamburger {
  display: none;
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 45;
  width: 42px;
  height: 42px;
  background: var(--ink);
  border: none;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.hamburger span {
  display: block;
  width: 18px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
}

.content {
  flex: 1;
  padding: 32px 40px 60px;
  max-width: 1080px;
  width: 100%;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 16px;
  flex-wrap: wrap;
}

.topbar h1 {
  font-size: 22px;
  margin: 0;
  line-height: 1.3;
}

.sub {
  margin: 6px 0 0;
  color: var(--ink-soft);
  font-size: 13.5px;
}

.add-btn {
  background: var(--ink);
  color: #fff;
  border: none;
  padding: 11px 18px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.add-btn:hover {
  background: var(--blue-deep);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state {
  color: var(--ink-soft);
  font-size: 14px;
  padding: 40px 0;
  text-align: center;
}

.banner {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.banner.error {
  background: #fdecea;
  color: var(--negative);
  border: 1px solid #f4c7c1;
}

.retry {
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  border-radius: var(--radius-sm);
  padding: 5px 12px;
  font-size: 12.5px;
  cursor: pointer;
  white-space: nowrap;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .hamburger {
    display: flex;
  }

  .content {
    padding: 72px 16px 48px;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    margin-bottom: 22px;
  }

  .topbar h1 {
    font-size: 19px;
  }

  .sub {
    font-size: 13px;
  }

  .add-btn {
    width: 100%;
    padding: 13px 16px;
    font-size: 14px;
    text-align: center;
  }

  .banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .retry {
    align-self: flex-end;
  }
}

@media (max-width: 380px) {
  .content {
    padding: 68px 12px 40px;
  }

  .topbar h1 {
    font-size: 17px;
  }
}
</style>