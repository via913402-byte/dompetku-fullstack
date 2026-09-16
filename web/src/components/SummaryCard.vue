<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  tone: { type: String, default: 'neutral' }, // neutral | positive | negative | blue
  detail: { type: String, default: '' }
})
</script>

<template>
  <div class="card" :class="tone">
    <span class="label">{{ label }}</span>
    <strong class="value mono">{{ value }}</strong>
    <span v-if="detail" class="detail">{{ detail }}</span>
  </div>
</template>

<style scoped>
.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--line);
}

.card.blue::before {
  background: var(--blue);
}

.card.positive::before {
  background: var(--positive);
}

.card.negative::before {
  background: var(--negative);
}

.label {
  font-size: 12.5px;
  color: var(--ink-soft);
  line-height: 1.3;
}

.value {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
  word-break: break-all; /* jaga-jaga angka panjang */
}

.card.blue .value {
  color: var(--blue-deep);
}

.card.positive .value {
  color: var(--positive);
}

.card.negative .value {
  color: var(--negative);
}

.detail {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.4;
}

/* ===== Mobile ===== */
@media (max-width: 960px) {
  .card {
    padding: 16px 18px;
    gap: 6px;
  }

  .label {
    font-size: 12px;
  }

  .value {
    font-size: 22px;
  }

  .detail {
    font-size: 11.5px;
  }
}

/* Extra small phones */
@media (max-width: 380px) {
  .card {
    padding: 14px 16px;
  }

  .value {
    font-size: 20px;
  }
}
</style>