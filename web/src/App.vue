<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import NavIcon from './components/NavIcon.vue'
import NotificationBell from './components/NotificationBell.vue'
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

// [DIUBAH] Subjudul sekarang berbeda untuk tiap halaman (dulu Transaksi memakai teks Ringkasan)
const pageSub = computed(() => {
  const map = {
    ringkasan: 'Pantau arus kas pribadimu dalam satu tampilan.',
    transaksi: 'Riwayat semua pemasukan dan pengeluaranmu.',
    tanggungan: 'Kelola angsuran, cicilan & tagihan rutin bulananmu.',
    laporan: 'Lihat ringkasan pemasukan & pengeluaran per bulan.'
  }
  return map[view.value] || 'Pantau arus kas pribadimu dalam satu tampilan.'
})
</script>

<template>
  <div class="app-shell">
    <Sidebar
      :active="view"
      :open="sidebarOpen"
      @navigate="handleNavigate"
      @close="sidebarOpen = false"
    />

    <div class="main-col">
      <header class="navbar">
        <button class="navbar-hamburger" @click="sidebarOpen = true" aria-label="Buka menu">
          <NavIcon name="menu" :size="16" />
        </button>

        <div class="navbar-text">
          <h1>{{ pageTitle }}</h1>
          <p class="navbar-sub">{{ pageSub }}</p>
        </div>

        <div class="navbar-actions">
          <NotificationBell />

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
        </div>
      </header>

      <main class="content">
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
    </div>

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
.app-shell {
  display: flex;
  min-height: 100vh;
}

.main-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ===== Navbar: tingginya disamakan dengan tinggi blok brand di sidebar (72px) ===== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 72px;
  background: #fff;
  border-bottom: 1px solid rgba(11, 13, 18, 0.08);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 24px;
  flex-shrink: 0;
}

.navbar-hamburger {
  display: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}

.navbar-text {
  min-width: 0;
  flex: 1;
}

.navbar-text h1 {
  font-size: 18px;
  margin: 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-sub {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: var(--ink-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.add-btn {
  background: var(--ink);
  color: #fff;
  border: none;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
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

/* [DIUBAH] konten dipusatkan di layar lebar (dulu menempel ke kiri) */
.content {
  flex: 1;
  padding: 32px 40px 60px;
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
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

/* ===== Mobile (960px, sama dengan Sidebar.vue) ===== */
@media (max-width: 960px) {
  .app-shell {
    flex-direction: column;
  }

  /* [DIUBAH] navbar satu baris: menu, judul, lonceng. Tinggi tetap, tidak lagi 2 baris. */
  .navbar {
    height: 60px;
    padding: 0 14px;
    gap: 10px;
  }

  .navbar-hamburger {
    display: flex;
  }

  .navbar-text h1 {
    font-size: 16px;
  }

  .navbar-sub {
    font-size: 11.5px;
  }

  /* [DIUBAH] tombol tambah menjadi tombol mengambang di kanan bawah agar tidak memakan tinggi layar */
  .add-btn {
    position: fixed;
    right: 16px;
    bottom: max(16px, env(safe-area-inset-bottom));
    z-index: 45;
    padding: 13px 20px;
    border-radius: 999px;
    font-size: 13.5px;
    box-shadow: 0 6px 18px rgba(11, 13, 18, 0.28);
  }

  .content {
    padding: 20px 16px 96px;
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
    padding: 18px 12px 96px;
  }
}
</style>