<script setup>
import { reactive, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  categories: { type: Array, required: true },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  type: 'expense',
  category: '',
  note: '',
  amount: '',
  date: today
})

const availableCategories = computed(() =>
  props.categories.filter((c) => c.type === form.type)
)

watch(
  () => form.type,
  () => {
    form.category = availableCategories.value[0]?.key || ''
  },
  { immediate: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.type = 'expense'
      form.note = ''
      form.amount = ''
      form.date = today
      document.body.style.overflow = 'hidden' // cegah scroll body
    } else {
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})

function submit() {
  if (!form.amount || Number(form.amount) <= 0 || !form.category) return
  emit('submit', { ...form })
}
</script>

<template>
  <Transition name="slide">
    <div v-if="open" class="scrim" @click.self="$emit('close')">
      <div class="panel">
        <div class="panel-head">
          <h3>Transaksi baru</h3>
          <button class="close" @click="$emit('close')" aria-label="Tutup">✕</button>
        </div>

        <div class="type-toggle">
          <button
            :class="{ active: form.type === 'expense' }"
            @click="form.type = 'expense'"
          >
            Pengeluaran
          </button>
          <button
            :class="{ active: form.type === 'income' }"
            @click="form.type = 'income'"
          >
            Pemasukan
          </button>
        </div>

        <form @submit.prevent="submit">
          <label class="field">
            <span>Jumlah (Rp)</span>
            <input
              v-model="form.amount"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              required
              inputmode="numeric"
            />
          </label>

          <label class="field">
            <span>Kategori</span>
            <select v-model="form.category" required>
              <option v-for="c in availableCategories" :key="c.key" :value="c.key">
                {{ c.label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Keterangan</span>
            <input
              v-model="form.note"
              type="text"
              placeholder="Contoh: Makan siang"
            />
          </label>

          <label class="field">
            <span>Tanggal</span>
            <input v-model="form.date" type="date" required />
          </label>

          <button type="submit" class="submit" :disabled="saving">
            {{ saving ? 'Menyimpan…' : 'Simpan transaksi' }}
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(11, 13, 18, 0.4);
  display: flex;
  justify-content: flex-end;
  z-index: 40;
  /* Agar aman di iOS */
  -webkit-overflow-scrolling: touch;
}

.panel {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: var(--panel);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 24px rgba(11, 13, 18, 0.12);
  overflow-y: auto;
}

/* Desktop */
@media (min-width: 480px) {
  .panel {
    width: 360px;
    padding: 24px;
  }
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-shrink: 0;
}

.panel-head h3 {
  font-size: 17px;
  margin: 0;
}

.close {
  background: transparent;
  border: none;
  font-size: 18px;
  color: var(--ink-soft);
  cursor: pointer;
  padding: 8px;
  margin: -8px;
  line-height: 1;
}

.type-toggle {
  display: flex;
  background: var(--line-soft);
  border-radius: var(--radius-sm);
  padding: 4px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.type-toggle button {
  flex: 1;
  border: none;
  background: transparent;
  padding: 11px 0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: var(--ink-soft);
  font-weight: 500;
  transition: all 0.15s ease;
}

.type-toggle button.active {
  background: var(--ink);
  color: #fff;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  color: var(--ink-soft);
}

.field input,
.field select {
  font-family: var(--font-display);
  font-size: 16px; /* penting: cegah zoom di iOS */
  color: var(--ink);
  padding: 13px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
  -webkit-appearance: none;
  appearance: none;
}

.field input:focus,
.field select:focus {
  border-color: var(--blue);
  outline: none;
}

.submit {
  margin-top: auto;
  background: var(--blue);
  color: #fff;
  border: none;
  padding: 15px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.submit:hover {
  background: var(--blue-deep);
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animasi */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.22s ease;
}

.slide-enter-active .panel,
.slide-leave-active .panel {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .panel,
.slide-leave-to .panel {
  transform: translateX(100%);
}

/* Extra safe area untuk iPhone dengan notch */
@supports (padding: max(0px)) {
  .panel {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}
</style>