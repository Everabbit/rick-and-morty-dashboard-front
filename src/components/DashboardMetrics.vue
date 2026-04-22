<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-6 col-md-3">
      <div class="metric-card">
        <div class="metric-label">Total de personagens</div>
        <div class="metric-value">
          <q-skeleton v-if="isLoading" type="text" width="60px" />
          <template v-else>{{ totalItems.toLocaleString('pt-BR') }}</template>
        </div>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <div class="metric-card">
        <div class="metric-label">Página atual</div>
        <div class="metric-value">
          <q-skeleton v-if="isLoading" type="text" width="60px" />
          <template v-else>
            {{ currentPage }}
            <span class="metric-secondary">/ {{ totalPages }}</span>
          </template>
        </div>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <div class="metric-card">
        <div class="metric-label">Registros sincronizados</div>
        <div class="metric-value">{{ totalUpserted.toLocaleString('pt-BR') }}</div>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <div class="metric-card">
        <div class="metric-label">Status da sincronização</div>
        <div class="metric-value row items-center q-gutter-xs no-wrap">
          <span class="status-dot" :class="syncDotClass" />
          <span class="metric-value-sm" :class="syncTextClass"
            >{{ syncStatusLabel }}
            <q-chip
              size="xs"
              color="grey-7"
              text-color="white"
              :label="`Última sync: ${lastSyncLabel}`"
          /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  totalUpserted: number;
  syncStatusLabel: string;
  lastSyncLabel: string;
  syncStatusRaw: string | undefined;
}>();

const syncDotClass = computed(() => ({
  'dot-green': props.syncStatusRaw === 'success',
  'dot-yellow': props.syncStatusRaw === 'partial',
  'dot-blue': props.syncStatusRaw === 'running',
  'dot-grey': !props.syncStatusRaw,
}));

const syncTextClass = computed(() => ({
  'text-green-9': props.syncStatusRaw === 'success',
  'text-amber-9': props.syncStatusRaw === 'partial',
  'text-blue-9': props.syncStatusRaw === 'running',
  'text-grey-7': !props.syncStatusRaw,
}));
</script>

<style scoped>
.metric-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 18px 20px;
  transition: box-shadow 0.15s ease;
}
.metric-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.metric-label {
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  margin-bottom: 8px;
}
.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}
.metric-value-sm {
  font-size: 1rem;
  font-weight: 600;
}
.metric-secondary {
  font-size: 1rem;
  font-weight: 400;
  color: #9ca3af;
}
.metric-sub {
  font-size: 0.72rem;
  color: #9ca3af;
}
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
}
.dot-green {
  background: #16a34a;
}
.dot-yellow {
  background: #d97706;
}
.dot-blue {
  background: #2563eb;
  animation: pulse-dot 1.4s ease-in-out infinite;
}
.dot-grey {
  background: #d1d5db;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
</style>
