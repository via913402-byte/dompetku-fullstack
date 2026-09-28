<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NavIcon from './NavIcon.vue'
import { useFinance } from '../composables/useFinance'

const { bills } = useFinance()

const open = ref(false)
const rootEl = ref(null)

function daysUntilDue(dueDay) {
  const today = new Date()
  let target = new Date(today.getFullYear(), today.getMonth(), dueDay)
  if (target < today) target = new Date(today.getFullYear(), today.getMonth() + 1, dueDay)
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

const notifications = computed(() => {
  return bills.value
    .filter((b) => !b.is_paid)
    .map((b) => ({ ...b, daysLeft: daysUntilDue(b.due_day) }))
    .filter((b) => b.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft)
})

const count = computed(() => notifications.value.length)

function statusText(daysLeft) {
  if (daysLeft <= 0) return 'Lewat jatuh tempo'
  if (daysLeft === 1) return 'Jatuh tempo besok'
  return `${daysLeft} hari lagi`
}

function handleOutsideClick(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
  <div class="notif-wrap" ref="rootEl">
    <button class="bell-btn" @click="open = !open" aria-label="Notifikasi">
      <NavIcon name="bell" :size="20" />
      <span v-if="count > 0" class="badge">{{ count > 9 ? '9+' : count }}</span>
    </button>

    <Transition name="fade">
      <div v-if="open" class="dropdown">
        <div class="dropdown-head">Notifikasi</div>

        <div v-if="count === 0" class="empty">Tidak ada tagihan mendekati jatuh tempo.</div>

        <div v-else class="list">
          <div v-for="b in notifications" :key="b.id" class="item">
            <NavIcon name="alert" :size="16" />
            <div class="item-text">
              <strong>{{ b.name }}</strong>
              <span :class="{ overdue: b.daysLeft <= 0 }">{{ statusText(b.daysLeft) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notif-wrap {
  position: relative;
}

.bell-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(11, 13, 18, 0.12);
  border-radius: var(--radius-sm);
  color: var(--ink);
  cursor: pointer;
  flex-shrink: 0;
}

.bell-btn:hover {
  background: rgba(11, 13, 18, 0.04);
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--negative, #d64545);
  color: #fff;
  font-size: 10.5px;
  font-weight: 600;
  min-width: 17px;
  height: 17px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 300px;
  max-height: 360px;
  overflow-y: auto;
  background: #fff;
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(11, 13, 18, 0.08);
  z-index: 70;
}

.dropdown-head {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid rgba(11, 13, 18, 0.08);
}

.empty {
  padding: 24px 16px;
  font-size: 13px;
  color: var(--ink-soft);
  text-align: center;
}

.list {
  display: flex;
  flex-direction: column;
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(11, 13, 18, 0.06);
  color: #b45309;
}

.item:last-child {
  border-bottom: none;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-text strong {
  font-size: 13.5px;
  color: var(--ink);
}

.item-text span {
  font-size: 12px;
  color: var(--ink-soft);
}

.item-text span.overdue {
  color: var(--negative, #d64545);
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ===== Mobile ===== */
@media (max-width: 480px) {
  .dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
  }
}
</style>