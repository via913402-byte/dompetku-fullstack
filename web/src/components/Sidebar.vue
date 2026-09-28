<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import NavIcon from './NavIcon.vue'

const props = defineProps({
  active: { type: String, default: 'ringkasan' },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['navigate', 'close'])

const items = [
  { key: 'ringkasan', label: 'Dashboard', glyph: '01' },
  { key: 'transaksi', label: 'Transaksi', glyph: '02' },
  { key: 'tanggungan', label: 'Tanggungan', glyph: '03' },
  { key: 'laporan', label: 'Laporan', glyph: '04' }
]

// [DIUBAH] Satu batas mobile untuk semua. Harus sama dengan
// @media (max-width: 960px) di bawah dan di App.vue.
const MOBILE_MAX = 960

function isMobile() {
  return window.innerWidth <= MOBILE_MAX
}

watch(
  () => props.open,
  (isOpen) => {
    if (isMobile()) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  }
)

// [BARU] Esc menutup drawer; melebarkan layar menutup drawer dan melepas kunci scroll
function handleKeydown(e) {
  if (e.key === 'Escape' && props.open) emit('close')
}

function handleResize() {
  if (!isMobile()) {
    document.body.style.overflow = ''
    if (props.open) emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})

function handleNavigate(key) {
  emit('navigate', key)
  if (isMobile()) {
    emit('close')
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="scrim"
      @click="$emit('close')"
    ></div>
  </Transition>

  <aside class="sidebar" :class="{ open }">
    <div class="brand">
      <span class="brand-mark">D</span>
      <div class="brand-text">
        <strong>Dompetku</strong>
        <span>Manajemen Keuangan</span>
      </div>
      <button class="close-btn" @click="$emit('close')" aria-label="Tutup menu">
        <NavIcon name="close" :size="18" />
      </button>
    </div>

    <nav class="nav">
      <button
        v-for="item in items"
        :key="item.key"
        class="nav-item"
        :class="{ active: active === item.key }"
        @click="handleNavigate(item.key)"
      >
        <span class="glyph mono">{{ item.glyph }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar-foot">
      <p>Data tersimpan di perangkat ini saja.</p>
    </div>
  </aside>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(11, 13, 18, 0.45);
  z-index: 50;
  display: none;
}

.sidebar {
  background: var(--ink);
  color: #f5f6f8;
  width: 240px;
  min-height: 100vh;
  height: 100vh;
  height: 100dvh;
  padding: 0 20px 28px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 60;
  position: sticky;
  top: 0;
  align-self: flex-start;
  overflow-y: auto;
}

/* ===== Brand: tinggi totalnya (20 padding-top + 36 baris + 16 padding-bottom) = 72px, disamakan dengan navbar ===== */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 20px;
  position: relative;
  flex-shrink: 0;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.brand-text strong {
  font-size: 15px;
}

.brand-text span {
  font-size: 12px;
  color: rgba(245, 246, 248, 0.55);
}

.close-btn {
  display: none;
  margin-left: auto;
  background: transparent;
  border: none;
  color: rgba(245, 246, 248, 0.7);
  padding: 6px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  color: rgba(245, 246, 248, 0.7);
  padding: 12px;
  border-radius: var(--radius-sm);
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.nav-item .glyph {
  font-size: 11px;
  color: rgba(245, 246, 248, 0.35);
  min-width: 20px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-item.active {
  background: var(--blue);
  color: #fff;
}

.nav-item.active .glyph {
  color: rgba(255, 255, 255, 0.7);
}

.sidebar-foot {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.sidebar-foot p {
  margin: 0;
  font-size: 11.5px;
  color: rgba(245, 246, 248, 0.4);
  line-height: 1.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Mobile Drawer (dulu 860px, sekarang 960px agar sama dengan App.vue) ===== */
@media (max-width: 960px) {
  .scrim {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 280px;
    max-width: 85vw;
    min-height: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    box-shadow: 8px 0 24px rgba(0, 0, 0, 0.2);
    padding: 24px 18px;
    padding-bottom: max(24px, env(safe-area-inset-bottom));
    align-self: auto;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .brand {
    padding: 0 0 20px;
    margin-bottom: 20px;
  }

  .close-btn {
    display: flex;
  }

  .nav-item {
    padding: 14px 12px;
    font-size: 15px;
  }
}
</style>