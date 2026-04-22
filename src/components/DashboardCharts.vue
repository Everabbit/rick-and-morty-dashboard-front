<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-4" v-for="chart in charts" :key="chart.title">
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">{{ chart.title }}</span>
          <span class="chart-hint">{{ chart.hint }}</span>
        </div>

        <div v-if="chart.data.length === 0" class="chart-empty">Sem dados para exibir.</div>

        <div v-else class="chart-rows">
          <div v-for="item in chart.data" :key="item.label" class="chart-row">
            <div class="row items-center justify-between no-wrap q-mb-xs">
              <span class="row-label ellipsis">{{ item.label }}</span>
              <span class="row-value"
                >{{ item.count }} <span class="row-pct">({{ item.percentage }}%)</span></span
              >
            </div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: `${item.ratio * 100}%`, background: chart.color }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type ChartDatum = {
  label: string;
  count: number;
  ratio: number;
  percentage: string;
};

const props = defineProps<{
  statusData: ChartDatum[];
  genderData: ChartDatum[];
  speciesData: ChartDatum[];
}>();

const charts = computed(() => [
  {
    title: 'Distribuição por Status',
    hint: 'Página atual',
    data: props.statusData,
    color: '#2563eb',
  },
  {
    title: 'Distribuição por Gênero',
    hint: 'Página atual',
    data: props.genderData,
    color: '#059669',
  },
  {
    title: 'Top 5 Espécies',
    hint: 'Página atual',
    data: props.speciesData,
    color: '#d97706',
  },
]);
</script>

<style scoped>
.chart-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 18px 20px;
  height: 100%;
  transition: box-shadow 0.15s ease;
}
.chart-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.chart-header {
  margin-bottom: 16px;
}
.chart-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}
.chart-hint {
  font-size: 0.72rem;
  color: #9ca3af;
}
.chart-empty {
  font-size: 0.8rem;
  color: #9ca3af;
  padding: 12px 0;
}
.chart-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chart-row {
}
.row-label {
  font-size: 0.8rem;
  color: #374151;
  font-weight: 500;
  max-width: 65%;
}
.row-value {
  font-size: 0.78rem;
  color: #374151;
  font-weight: 600;
  white-space: nowrap;
}
.row-pct {
  font-weight: 400;
  color: #9ca3af;
}
.bar-track {
  height: 6px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
}
</style>
