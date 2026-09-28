<script setup>
// Simpan di web/src/components/SearchInput.vue
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Cari…' },
  label: { type: String, default: 'Cari' }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search">
    <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>

    <input
      class="search-input"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="label"
      autocomplete="off"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.esc="$emit('update:modelValue', '')"
    />

    <button
      v-if="modelValue"
      type="button"
      class="search-clear"
      aria-label="Hapus pencarian"
      @click="$emit('update:modelValue', '')"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.search {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ink-soft);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 38px 0 36px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 14px;
  appearance: none;
  -webkit-appearance: none;
}

.search-input::placeholder {
  color: var(--ink-soft);
}

.search-input:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* sembunyikan tombol hapus bawaan browser, sudah ada tombol sendiri */
.search-input::-webkit-search-cancel-button,
.search-input::-webkit-search-decoration {
  -webkit-appearance: none;
  display: none;
}

.search-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--ink-soft);
  cursor: pointer;
}

.search-clear:hover {
  background: rgba(11, 13, 18, 0.06);
  color: var(--ink);
}

/* 16px di HP supaya iOS tidak memperbesar halaman saat kolom diketuk */
@media (max-width: 960px) {
  .search-input {
    font-size: 16px;
  }
}
</style>