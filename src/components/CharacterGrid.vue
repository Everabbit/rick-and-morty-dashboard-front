<template>
  <div class="grid-panel">
    <!-- Panel header -->
    <div class="grid-panel-header">
      <div>
        <span class="panel-title">Personagens</span>
        <span class="panel-count">{{ count }} resultado(s) nesta página</span>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-select
          dense
          outlined
          emit-value
          map-options
          label="Itens por página"
          style="min-width: 140px"
          :options="limitOptions"
          :model-value="limit"
          @update:model-value="emit('limit-change', $event)"
        />
      </div>
    </div>

    <q-separator />

    <div class="grid-body">
      <!-- Skeleton -->
      <div v-if="isInitialLoading" class="char-grid">
        <div v-for="n in 12" :key="`sk-${n}`" class="skeleton-card">
          <q-skeleton type="rect" class="skeleton-img" square />
          <div class="q-pa-sm column q-gutter-xs">
            <q-skeleton type="text" width="70%" />
            <q-skeleton type="text" width="50%" />
            <q-skeleton type="text" width="55%" />
            <q-skeleton type="text" width="40%" />
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div v-else-if="characters.length > 0" class="char-grid">
        <CharacterCard
          v-for="character in characters"
          :key="character.id"
          :character="character"
          @click="emit('open', $event)"
        />
      </div>

      <!-- Empty -->
      <div v-else class="empty-state">
        <q-icon name="search_off" size="40px" color="grey-4" />
        <p class="empty-title">Nenhum personagem encontrado</p>
        <p class="empty-hint">Tente ajustar os filtros aplicados.</p>
        <q-btn
          v-if="hasAnyFilter"
          outline
          color="primary"
          label="Limpar filtros"
          size="sm"
          no-caps
          @click="emit('clear-filters')"
        />
      </div>
    </div>

    <!-- Subsequent load overlay -->
    <q-inner-loading :showing="isLoading && !isInitialLoading">
      <q-spinner-dots size="32px" color="primary" />
    </q-inner-loading>

    <!-- Pagination footer -->
    <div v-if="!isInitialLoading">
      <div class="grid-panel-footer">
        <span class="footer-total"> Total: {{ totalItems.toLocaleString('pt-BR') }} itens </span>

        <q-pagination
          v-if="totalPages > 1"
          class="custom-pagination"
          :model-value="currentPage"
          @update:model-value="emit('page-change', $event)"
          :max="totalPages"
          :max-pages="5"
          boundary-links
          direction-links
          ellipses
          flat
          active-design="unelevated"
          active-color="primary"
          color="grey-7"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from 'src/interfaces/character.interface';
import CharacterCard from './CharacterCard.vue';

defineProps<{
  characters: Character[];
  isLoading: boolean;
  isInitialLoading: boolean;
  hasAnyFilter: boolean;
  count: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: 'open', character: Character): void;
  (e: 'clear-filters'): void;
  (e: 'limit-change', value: number): void;
  (e: 'page-change', value: number): void;
}>();

const limitOptions = [10, 20, 50, 100].map((v) => ({ label: `${v} por página`, value: v }));
</script>

<style scoped>
.grid-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  position: relative;
  margin: 16px 0 16px;
}

.grid-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 20px;
  background: #fafafa;
}

.panel-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
  margin-right: 8px;
}

.panel-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.grid-body {
  padding: 20px;
  position: relative;
  min-height: 200px;
}

/* Responsive grid */
.char-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 600px) {
  .char-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .char-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Skeleton */
.skeleton-card {
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}
.skeleton-img {
  width: 100%;
  aspect-ratio: 1 / 1;
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 24px;
  gap: 8px;
}
.empty-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}
.empty-hint {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0 0 8px;
}

/* Footer */
.grid-panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-top: 1px solid #e5e7eb;
}

.footer-total {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.custom-pagination :deep(.q-btn) {
  border-radius: 10px;
  min-width: 38px;
  height: 38px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.custom-pagination :deep(.q-btn:hover) {
  background: #eef2ff;
}

.custom-pagination :deep(.q-btn--active) {
  background: #6366f1 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}
</style>
