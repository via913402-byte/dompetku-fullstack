<script setup>
import { computed } from 'vue'
import { formatMonthLabel, formatRupiah } from '../utils/format'

const props = defineProps({
  months: { type: Array, required: true } // [{ key, date, income, expense }]
})

const chartHeight = 180
const chartWidth = 560
const paddingLeft = 4
const paddingRight = 4

const maxValue = computed(() => {
  const values = props.months.flatMap((m) => [m.income, m.expense])
  return Math.max(...values, 1)
})

function barHeight(value) {
  return Math.max((value / maxValue.value) * (chartHeight - 28), 0)
}

const groupWidth = computed(() => {
  if (!props.months.length) return 0
  return (chartWidth - paddingLeft - paddingRight) / props.months.length
})
</script>

<template>
  <div class="trend">
    <div class="chart-wrap">
      <svg
        :viewBox="`0 0 ${chartWidth} ${chartHeight + 28}`"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Grafik pemasukan dan pengeluaran per bulan"
      >
        <!-- Baseline -->
        <line
          :x1="0"
          :y1="chartHeight"
          :x2="chartWidth"
          :y2="chartHeight"
          stroke="var(--line)"
          stroke-width="1"
        />

        <g
          v-for="(m, i) in months"
          :key="m.key"
          :transform="`translate(${paddingLeft + i * groupWidth}, 0)`"
        >
          <!-- Pemasukan -->
          <rect
            :x="groupWidth / 2 - 15"
            :y="chartHeight - barHeight(m.income)"
            width="12"
            :height="barHeight(m.income)"
            rx="2.5"
            fill="var(--blue)"
          >
            <title>Pemasukan: {{ formatRupiah(m.income) }}</title>
          </rect>

          <!-- Pengeluaran -->
          <rect
            :x="groupWidth / 2 + 3"
            :y="chartHeight - barHeight(m.expense)"
            width="12"
            :height="barHeight(m.expense)"
            rx="2.5"
            fill="var(--ink)"
          >
            <title>Pengeluaran: {{ formatRupiah(m.expense) }}</title>
          </rect>

          <!-- Label bulan -->
          <text
            :x="groupWidth / 2"
            :y="chartHeight + 18"
            text-anchor="middle"
            class="axis-label"
          >
            {{ formatMonthLabel(m.date) }}
          </text>
        </g>
      </svg>
    </div>

    <div class="legend">
      <span class="legend-item">
        <i class="dot blue"></i>Pemasukan
      </span>
      <span class="legend-item">
        <i class="dot ink"></i>Pengeluaran
      </span>
    </div>
  </div>
</template>

<style scoped>
.trend {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.chart-wrap {
  width: 100%;
  overflow: hidden;
}

svg {
  width: 100%;
  height: auto;
  display: block;
  max-height: 220px;
}

.axis-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-soft);
}

.legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink-soft);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}

.dot.blue {
  background: var(--blue);
}

.dot.ink {
  background: var(--ink);
}

/* ===== Mobile ===== */
@media (max-width: 600px) {
  .trend {
    gap: 12px;
  }

  svg {
    max-height: 180px;
  }

  .axis-label {
    font-size: 9px;
  }

  .legend {
    gap: 14px;
  }

  .legend-item {
    font-size: 12px;
  }
}
</style>