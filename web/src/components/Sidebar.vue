<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  active: { type: String, default: 'ringkasan' },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['navigate', 'close'])

const items = [
  { key: 'ringkasan', label: 'Ringkasan', glyph: '01' },
  { key: 'transaksi', label: 'Transaksi', glyph: '02' },
  { key: 'tanggungan', label: 'Tanggungan', glyph: '03' },
  { key: 'laporan', label: 'Laporan', glyph: '04' }   // ← ganti dari anggaran
]

watch(
  () => props.open,
  (isOpen) => {
    if (window.innerWidth <= 860) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})

function handleNavigate(key) {
  emit('navigate', key)
  if (window.innerWidth <= 860) {
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
        ✕
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
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 60;
  position: sticky;        /* ← sticky di desktop */
  top: 0;
  align-self: flex-start;
  overflow-y: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 24px;
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
  font-size: 18px;
  padding: 6px;
  cursor: pointer;
  line-height: 1;
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

/* ===== Mobile Drawer ===== */
@media (max-width: 860px) {
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

  .close-btn {
    display: block;
  }

  .brand {
    padding-bottom: 24px;
    margin-bottom: 20px;
  }

  .nav-item {
    padding: 14px 12px;
    font-size: 15px;
  }
}
</style>