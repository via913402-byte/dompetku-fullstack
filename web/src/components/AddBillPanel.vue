<script setup>
import { reactive, watch, onUnmounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  name: '',
  amount: '',
  dueDay: 1,
  note: ''
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.name = ''
      form.amount = ''
      form.dueDay = 1
      form.note = ''
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})

function submit() {
  if (!form.name.trim() || !form.amount || Number(form.amount) <= 0) return
  emit('submit', {
    name: form.name.trim(),
    amount: Number(form.amount),
    dueDay: Number(form.dueDay),
    note: form.note.trim()
  })
}
</script>

<template>
  <Transition name="slide">
    <div v-if="open" class="scrim" @click.self="$emit('close')">
      <div class="panel">
        <div class="panel-head">
          <h3>Tagihan baru</h3>
          <button class="close" @click="$emit('close')" aria-label="Tutup">✕</button>
        </div>

        <form @submit.prevent="submit">
          <label class="field">
            <span>Nama Tagihan</span>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Angsuran HP, Listrik, Internet"
              required
            />
          </label>

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
            <span>Jatuh Tempo (tanggal)</span>
            <select v-model="form.dueDay">
              <option v-for="d in 31" :key="d" :value="d">Tanggal {{ d }}</option>
            </select>
          </label>

          <label class="field">
            <span>Keterangan (opsional)</span>
            <input
              v-model="form.note"
              type="text"
              placeholder="Contoh: Cicilan ke-5 / 12"
            />
          </label>

          <button type="submit" class="submit" :disabled="saving">
            {{ saving ? 'Menyimpan…' : 'Simpan tagihan' }}
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
  margin-bottom: 20px;
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
  font-size: 16px;
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

.submit:disabled {
  opacity: 0.6;
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
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}
</style>