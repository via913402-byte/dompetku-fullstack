<script setup>
import { reactive, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  categories: { type: Array, required: true },
  saving: { type: Boolean, default: false },
  editData: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.editData)
const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  type: 'expense',
  category: '',
  note: '',
  amount: '',
  amountDisplay: '',
  date: today
})

const availableCategories = computed(() =>
  props.categories.filter((c) => c.type === form.type)
)

watch(
  () => form.type,
  () => {
    if (!isEdit.value) {
      form.category = availableCategories.value[0]?.key || ''
    }
  }
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.editData) {
        form.type = props.editData.type || 'expense'
        form.category = props.editData.category || ''
        form.note = props.editData.note || ''
        form.amount = String(props.editData.amount ?? '')
        form.amountDisplay = formatRupiah(props.editData.amount)
        form.date = props.editData.date || today
      } else {
        form.type = 'expense'
        form.note = ''
        form.amount = ''
        form.amountDisplay = ''
        form.date = today
        form.category = availableCategories.value[0]?.key || ''
      }
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})

function formatRupiah(value) {
  if (value === '' || value === null || value === undefined) return ''
  let str = String(value).replace(',', '.')
  str = str.replace(/[^\d.]/g, '')
  const parts = str.split('.')
  let integer = parts[0] || ''
  let decimal = parts[1] !== undefined ? parts[1].slice(0, 2) : undefined
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  if (decimal !== undefined) {
    return decimal.length > 0 ? `${integer},${decimal}` : integer
  }
  return integer
}

function parseRupiah(displayValue) {
  if (!displayValue) return ''
  return displayValue
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '')
}

function onAmountInput(e) {
  const input = e.target.value
  const cleaned = input.replace(/[^\d.,]/g, '')
  const parsed = parseRupiah(cleaned)
  form.amount = parsed
  form.amountDisplay = formatRupiah(parsed)
}

function submit() {
  const amountNum = Number(form.amount)
  if (!amountNum || amountNum <= 0 || !form.category) return

  emit('submit', {
    id: props.editData?.id,
    type: form.type,
    category: form.category,
    note: form.note,
    amount: amountNum,
    date: form.date
  })
}
</script>

<template>
  <Transition name="slide">
    <div v-if="open" class="scrim" @click.self="$emit('close')">
      <div class="panel">
        <div class="panel-head">
          <div>
            <h3>{{ isEdit ? 'Edit transaksi' : 'Transaksi baru' }}</h3>
            <p class="subtitle">{{ isEdit ? 'Ubah data transaksi' : 'Catat pemasukan atau pengeluaran' }}</p>
          </div>
          <button class="close" @click="$emit('close')" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="type-toggle">
          <button :class="{ active: form.type === 'expense' }" @click="form.type = 'expense'">
            Pengeluaran
          </button>
          <button :class="{ active: form.type === 'income' }" @click="form.type = 'income'">
            Pemasukan
          </button>
        </div>

        <form @submit.prevent="submit">
          <label class="field">
            <span class="label">Jumlah</span>
            <div class="amount-input">
              <span class="currency">Rp</span>
              <input
                :value="form.amountDisplay"
                type="text"
                inputmode="decimal"
                placeholder="0"
                required
                @input="onAmountInput"
              />
            </div>
          </label>

          <label class="field">
            <span class="label">Kategori</span>
            <div class="select-wrapper">
              <select v-model="form.category" required>
                <option v-for="c in availableCategories" :key="c.key" :value="c.key">
                  {{ c.label }}
                </option>
              </select>
              <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </label>

          <label class="field">
            <span class="label">Keterangan <span class="optional">(opsional)</span></span>
            <input v-model="form.note" type="text" placeholder="Contoh: Makan siang, Gaji, dll" />
          </label>

          <label class="field">
            <span class="label">Tanggal</span>
            <input v-model="form.date" type="date" required />
          </label>

          <button type="submit" class="submit" :disabled="saving">
            {{ saving ? 'Menyimpan…' : (isEdit ? 'Simpan perubahan' : 'Simpan transaksi') }}
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
  background: rgba(15, 17, 23, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  z-index: 40;
  -webkit-overflow-scrolling: touch;
}

.panel {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: #ffffff;
  padding: 24px 20px 28px;
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
}

@media (min-width: 480px) {
  .panel {
    width: 380px;
    padding: 28px 24px 32px;
  }
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
  flex-shrink: 0;
}

.panel-head h3 {
  font-size: 18px;
  font-weight: 650;
  margin: 0 0 3px;
  color: #111827;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.close {
  background: #f3f4f6;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.close:hover {
  background: #e5e7eb;
  color: #111827;
}

.type-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.type-toggle button {
  flex: 1;
  border: none;
  background: transparent;
  padding: 11px 0;
  border-radius: 9px;
  font-size: 13.5px;
  cursor: pointer;
  color: #6b7280;
  font-weight: 550;
  transition: all 0.18s ease;
}

.type-toggle button.active {
  background: #111827;
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
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
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.optional {
  font-weight: 400;
  color: #9ca3af;
}

.field input,
.field select {
  font-family: inherit;
  font-size: 15px;
  color: #111827;
  padding: 13px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 11px;
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  -webkit-appearance: none;
  appearance: none;
}

.field input:focus,
.field select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.field input::placeholder {
  color: #9ca3af;
}

.amount-input {
  display: flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 11px;
  background: #ffffff;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.amount-input:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.amount-input .currency {
  padding: 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1.5px solid #e5e7eb;
}

.amount-input input {
  border: none !important;
  flex: 1;
  padding: 13px 14px;
  font-size: 18px;
  font-weight: 600;
  background: transparent;
  outline: none;
  min-width: 0;
  box-shadow: none !important;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding-right: 40px;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.submit {
  margin-top: 10px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.18s ease;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
}

.submit:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.submit:active:not(:disabled) {
  transform: translateY(0);
}

.submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.22s ease;
}

.slide-enter-active .panel,
.slide-leave-active .panel {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .panel,
.slide-leave-to .panel {
  transform: translateX(100%);
}

@supports (padding: max(0px)) {
  .panel {
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
    padding-bottom: max(28px, env(safe-area-inset-bottom));
  }
}
</style>