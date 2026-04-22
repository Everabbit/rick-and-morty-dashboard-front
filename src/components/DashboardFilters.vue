<template>
  <div class="filters-panel">
    <div class="filters-header">
      <div>
        <span class="filters-title">Filtros</span>
      </div>
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        label="Limpar filtros"
        icon="restart_alt"
        size="sm"
        :disable="!hasAnyFilter"
        @click="emit('clear')"
      />
    </div>

    <div class="filters-body">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-input
            outlined
            dense
            clearable
            label="Nome"
            :model-value="filters.name"
            @update:model-value="emit('text-change', 'name', $event)"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-input
            outlined
            dense
            clearable
            label="Espécie"
            :model-value="filters.species"
            @update:model-value="emit('text-change', 'species', $event)"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-input
            outlined
            dense
            clearable
            label="Tipo"
            :model-value="filters.type"
            @update:model-value="emit('text-change', 'type', $event)"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-input
            outlined
            dense
            clearable
            label="Origem"
            :model-value="filters.originName"
            @update:model-value="emit('text-change', 'originName', $event)"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-input
            outlined
            dense
            clearable
            label="Localização atual"
            :model-value="filters.locationName"
            @update:model-value="emit('text-change', 'locationName', $event)"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-4 col-lg-2">
          <q-select
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Status"
            :options="characterStatusOptions"
            :model-value="filters.status"
            @update:model-value="emit('number-change', 'status', $event)"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-select
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Gênero"
            :options="characterGenderOptions"
            :model-value="filters.gender"
            @update:model-value="emit('number-change', 'gender', $event)"
          />
        </div>

        <div class="col-6 col-sm-3 col-md-4 col-lg-2">
          <q-input
            outlined
            dense
            type="number"
            min="0"
            clearable
            label="Ep. mín."
            :model-value="filters.episodeCountMin"
            @update:model-value="emit('episode-change', 'episodeCountMin', $event)"
          />
        </div>

        <div class="col-6 col-sm-3 col-md-4 col-lg-2">
          <q-input
            outlined
            dense
            type="number"
            min="0"
            clearable
            label="Ep. máx."
            :model-value="filters.episodeCountMax"
            @update:model-value="emit('episode-change', 'episodeCountMax', $event)"
          />
        </div>
      </div>

      <!-- Sort row -->
      <div class="row q-col-gutter-sm q-mt-xs">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-select
            outlined
            dense
            emit-value
            map-options
            label="Ordenar por"
            :options="sortByOptions"
            :model-value="filters.sortBy"
            @update:model-value="emit('sort-by-change', $event)"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3 col-lg-2">
          <q-btn-toggle
            spread
            unelevated
            toggle-color="primary"
            color="white"
            text-color="grey-7"
            toggle-text-color="white"
            :model-value="filters.sortOrder"
            :options="sortOrderOptions"
            class="sort-toggle"
            @update:model-value="emit('sort-order-change', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filters } from 'src/interfaces/characterFilters.interface';
import { characterGenderOptions, characterStatusOptions } from 'src/utils/characterLabels.util';

defineProps<{
  filters: Filters;
  hasAnyFilter: boolean;
}>();

const emit = defineEmits<{
  (e: 'clear'): void;
  (
    e: 'text-change',
    key: 'name' | 'species' | 'type' | 'originName' | 'locationName',
    value: string | number | null,
  ): void;
  (e: 'number-change', key: 'status' | 'gender', value: number | null): void;
  (
    e: 'episode-change',
    key: 'episodeCountMin' | 'episodeCountMax',
    value: string | number | null,
  ): void;
  (e: 'sort-by-change', value: string | null): void;
  (e: 'sort-order-change', value: string | null): void;
}>();

const sortByOptions = [
  { label: 'ID Externo', value: 'externalId' },
  { label: 'Nome', value: 'name' },
  { label: 'Status', value: 'status' },
  { label: 'Espécie', value: 'species' },
  { label: 'Gênero', value: 'gender' },
  { label: 'Origem', value: 'originName' },
  { label: 'Localização', value: 'locationName' },
  { label: 'Tipo', value: 'type' },
  { label: 'Qtd. Episódios', value: 'episodeCount' },
  { label: 'Atualizado em', value: 'updatedAt' },
  { label: 'Última sync', value: 'lastSyncedAt' },
];

const sortOrderOptions = [
  { label: 'Asc', value: 'ASC' },
  { label: 'Desc', value: 'DESC' },
];
</script>

<style scoped>
.filters-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0 16px;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
  gap: 12px;
}

.filters-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
  margin-right: 10px;
}

.filters-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.filters-body {
  padding: 16px 20px 18px;
}

.sort-toggle {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  height: 40px;
}
</style>
