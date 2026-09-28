<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 20 }
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="nav-icon"
  >
    <path v-if="name === 'bell'" d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path v-if="name === 'bell'" d="M13.73 21a2 2 0 0 1-3.46 0" />

    <line v-if="name === 'menu'" x1="4" y1="7" x2="20" y2="7" />
    <line v-if="name === 'menu'" x1="4" y1="12" x2="20" y2="12" />
    <line v-if="name === 'menu'" x1="4" y1="17" x2="20" y2="17" />

    <line v-if="name === 'close'" x1="18" y1="6" x2="6" y2="18" />
    <line v-if="name === 'close'" x1="6" y1="6" x2="18" y2="18" />

    <circle v-if="name === 'check'" cx="12" cy="12" r="10" />
    <path v-if="name === 'check'" d="M9 12l2 2 4-4" />

    <path v-if="name === 'alert'" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line v-if="name === 'alert'" x1="12" y1="9" x2="12" y2="13" />
    <line v-if="name === 'alert'" x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
</template>

<style scoped>
.nav-icon {
  flex-shrink: 0;
  display: block;
}
</style>