<script setup>
import { formatRupiah } from '../utils/format'

const props = defineProps({
  categories: { type: Array, required: true } // [{ key, label, total, limit }]
})

function progress(cat) {
  if (!cat.limit) return 100
  return Math.min(100, Math.round((cat.total / cat.limit) * 100))
}

function isOver(cat) {
  return cat.limit && cat.total > cat.limit
}
</script>

<template>
  <ul class="bars">
    <li v-for="cat in categories" :key="cat.key" class="bar-row">
      <div class="bar-head">
        <span class="label">{{ cat.label }}</span>
        <span class="amount mono">
          {{ formatRupiah(cat.total) }}
          <template v-if="cat.limit">
            <span class="limit"> / {{ formatRupiah(cat.limit) }}</span>
          </template>
        </span>
      </div>
      <div class="track">
        <div
          class="fill"
          :class="{ over: isOver(cat) }"
          :style="{ width: progress(cat) + '%' }"
        ></div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.bars {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.bar-row {
  width: 100%;
}

.bar-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 7px;
  font-size: 13px;
}

.label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ink);
  font-weight: 500;
}

.amount {
  flex-shrink: 0;
  color: var(--ink-soft);
  font-size: 12px;
  text-align: right;
  white-space: nowrap;
}

.limit {
  opacity: 0.7;
}

.track {
  height: 8px;
  background: var(--line-soft);
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--blue);
  border-radius: 999px;
  transition: width 0.35s ease;
  min-width: 0;
}

.fill.over {
  background: var(--negative);
}

/* Mobile refinement */
@media (max-width: 420px) {
  .bars {
    gap: 16px;
  }

  .bar-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    margin-bottom: 6px;
  }

  .label {
    font-size: 13px;
    white-space: normal;
  }

  .amount {
    font-size: 12px;
    text-align: left;
  }

  .track {
    height: 7px;
  }
}
</style>