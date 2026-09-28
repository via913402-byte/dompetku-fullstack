<script setup>
import { reactive, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  editData: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.editData)
const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  name: '',
  amount: '',
  amountDisplay: '',
  dueDate: today,   // sekarang pakai full date (YYYY-MM-DD)
  note: ''
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.editData) {
        form.name = props.editData.name || ''
        form.amount = String(props.editData.amount ?? '')
        form.amountDisplay = formatRupiah(props.editData.amount)
        // dukungan data lama (dueDay) maupun data baru (dueDate)
        form.dueDate = props.editData.dueDate 
          || (props.editData.dueDay 
              ? `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(props.editData.dueDay).padStart(2, '0')}`
              : today)
        form.note = props.editData.note || ''
      } else {
        form.name = ''
        form.amount = ''
        form.amountDisplay = ''
        form.dueDate = today
        form.note = ''
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
  if (!form.name.trim() || !form.amount || Number(form.amount) <= 0 || !form.dueDate) return

  // Kirim dueDate (full date) + dueDay (untuk kompatibilitas data lama)
  const day = Number(form.dueDate.split('-')[2])

  emit('submit', {
    id: props.editData?.id,
    name: form.name.trim(),
    amount: Number(form.amount),
    dueDate: form.dueDate,
    dueDay: day,
    note: form.note.trim()
  })
}
</script>

<template>
  <Transition name="slide">
    <div v-if="open" class="scrim" @click.self="$emit('close')">
      <div class="panel">
        <div class="panel-head">
          <div>
            <h3>{{ isEdit ? 'Edit tagihan' : 'Tagihan baru' }}</h3>
            <p class="subtitle">{{ isEdit ? 'Ubah data tagihan' : 'Tambah tagihan bulanan' }}</p>
          </div>
          <button class="close" @click="$emit('close')" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submit">
          <label class="field">
            <span class="label">Nama Tagihan</span>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Angsuran HP, Listrik, Internet"
              required
            />
          </label>

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
            <span class="label">Jatuh Tempo</span>
            <input
              v-model="form.dueDate"
              type="date"
              required
            />
          </label>

          <label class="field">
            <span class="label">Keterangan <span class="optional">(opsional)</span></span>
            <input
              v-model="form.note"
              type="text"
              placeholder="Contoh: Cicilan ke-5 / 12"
            />
          </label>

          <button type="submit" class="submit" :disabled="saving">
            {{ saving ? 'Menyimpan…' : (isEdit ? 'Simpan perubahan' : 'Simpan tagihan') }}
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
  margin-bottom: 24px;
}

.panel-head h3 {
  font-size: 18px;
  font-weight: 650;
  margin: 0 0 3px;
  color: #111827;
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
}

.close:hover {
  background: #e5e7eb;
  color: #111827;
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
}

.submit:hover:not(:disabled) {
  background: #1d4ed8;
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

@supports (padding: max(0px)) {
  .panel {
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
    padding-bottom: max(28px, env(safe-area-inset-bottom));
  }
}
</style>