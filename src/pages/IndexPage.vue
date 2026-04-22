<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container column">
      <!-- Page title row -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Personagens de Rick and Morty</h1>
        </div>

        <div class="page-actions">
          <q-btn
            outline
            color="primary"
            icon="refresh"
            label="Atualizar personagens"
            no-caps
            size="sm"
            :loading="dashboardStore.isLoadingCharacters"
            @click="refreshCharacters"
          />
          <q-btn
            outline
            color="grey-7"
            icon="history"
            label="Atualizar sync"
            no-caps
            size="sm"
            :loading="dashboardStore.isLoadingSyncStatus"
            @click="refreshSyncStatus"
          />
        </div>
      </div>

      <!-- Error banners -->
      <q-banner
        v-if="dashboardStore.charactersError"
        dense
        rounded
        class="error-banner"
        icon="error_outline"
      >
        <strong>Falha ao carregar personagens.</strong>
        {{ dashboardStore.charactersError }}
        <template #action>
          <q-btn
            flat
            dense
            no-caps
            color="negative"
            label="Tentar novamente"
            @click="refreshCharacters"
          />
        </template>
      </q-banner>

      <q-banner
        v-if="dashboardStore.syncStatusError"
        dense
        rounded
        class="warning-banner"
        icon="warning_amber"
      >
        <strong>Falha ao carregar status de sync.</strong>
        {{ dashboardStore.syncStatusError }}
        <template #action>
          <q-btn
            flat
            dense
            no-caps
            color="warning"
            label="Tentar novamente"
            @click="refreshSyncStatus"
          />
        </template>
      </q-banner>

      <!-- Metrics -->
      <DashboardMetrics
        :is-loading="isInitialLoading"
        :total-items="dashboardStore.pagination.totalItems"
        :current-page="dashboardStore.pagination.page"
        :total-pages="dashboardStore.pagination.totalPages"
        :total-upserted="dashboardStore.syncStatus?.totalUpserted ?? 0"
        :sync-status-label="syncStatusLabel"
        :last-sync-label="lastSyncLabel"
        :sync-status-raw="dashboardStore.syncStatus?.status"
      />

      <!-- Filters -->
      <DashboardFilters
        :filters="dashboardStore.filters"
        :has-any-filter="hasAnyFilter"
        @clear="clearAllFilters"
        @text-change="onTextFilterChange"
        @number-change="onNumberFilterChange"
        @episode-change="onEpisodeFilterChange"
        @sort-by-change="onSortByChange"
        @sort-order-change="onSortOrderChange"
      />

      <!-- Charts -->
      <DashboardCharts
        :status-data="statusChartData"
        :gender-data="genderChartData"
        :species-data="speciesChartData"
      />

      <!-- Character grid -->
      <CharacterGrid
        :characters="dashboardStore.characters"
        :is-loading="dashboardStore.isLoadingCharacters"
        :is-initial-loading="isInitialLoading"
        :has-any-filter="hasAnyFilter"
        :count="dashboardStore.characters.length"
        :limit="dashboardStore.filters.limit"
        :total-items="dashboardStore.pagination.totalItems"
        :total-pages="dashboardStore.pagination.totalPages"
        :current-page="dashboardStore.filters.page"
        @open="openCharacter"
        @clear-filters="clearAllFilters"
        @limit-change="onLimitChange"
        @page-change="onPageChange"
      />
    </div>

    <!-- Character dialog -->
    <CharacterDialog v-model="dialogOpen" :character="selectedCharacter" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { LocationQuery, LocationQueryRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { useDashboardStore } from 'src/stores/dashboard.store';
import { getCharacterGenderLabel, getCharacterStatusLabel } from 'src/utils/characterLabels.util';
import type { Character } from 'src/interfaces/character.interface';

import DashboardMetrics from 'src/components/DashboardMetrics.vue';
import DashboardFilters from 'src/components/DashboardFilters.vue';
import DashboardCharts from 'src/components/DashboardCharts.vue';
import CharacterGrid from 'src/components/CharacterGrid.vue';
import CharacterDialog from 'src/components/CharacterDialog.vue';
import type { ChartDatum } from 'src/components/DashboardCharts.vue';

const dashboardStore = useDashboardStore();
const route = useRoute();
const router = useRouter();

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const dialogOpen = ref(false);
const selectedCharacter = ref<Character | null>(null);

const openCharacter = (character: Character) => {
  selectedCharacter.value = character;
  dialogOpen.value = true;
};

const syncStatusLabel = computed(() => {
  if (!dashboardStore.syncStatus) return 'Desconhecido';
  const map: Record<string, string> = {
    running: 'Em andamento',
    partial: 'Parcial',
    success: 'Concluído',
    failed: 'Falhou',
  };
  return map[dashboardStore.syncStatus.status] ?? 'Desconhecido';
});

const lastSyncLabel = computed(() => {
  const value = dashboardStore.syncStatus?.finishedAt;
  if (!value) return 'Não disponível';
  return formatDateTime(value);
});

const activeFiltersCount = computed(() => Object.keys(dashboardStore.activeQuery).length);
const hasAnyFilter = computed(() => activeFiltersCount.value > 0);
const isInitialLoading = computed(
  () => dashboardStore.isLoadingCharacters && dashboardStore.characters.length === 0,
);

const groupBy = <T extends string | number>(
  rows: Character[],
  selector: (row: Character) => T,
): Map<T, number> => {
  const map = new Map<T, number>();
  rows.forEach((r) => map.set(selector(r), (map.get(selector(r)) ?? 0) + 1));
  return map;
};

const toChartData = (
  entries: Array<{ label: string; count: number }>,
  total: number,
): ChartDatum[] => {
  if (total <= 0) return [];
  return entries.map(({ label, count }) => ({
    label,
    count,
    ratio: count / total,
    percentage: ((count / total) * 100).toFixed(1),
  }));
};

const statusChartData = computed<ChartDatum[]>(() => {
  const rows = dashboardStore.characters;
  return toChartData(
    Array.from(groupBy(rows, (r) => r.status).entries())
      .map(([s, c]) => ({ label: getCharacterStatusLabel(s), count: c }))
      .sort((a, b) => b.count - a.count),
    rows.length,
  );
});

const genderChartData = computed<ChartDatum[]>(() => {
  const rows = dashboardStore.characters;
  return toChartData(
    Array.from(groupBy(rows, (r) => r.gender).entries())
      .map(([g, c]) => ({ label: getCharacterGenderLabel(g), count: c }))
      .sort((a, b) => b.count - a.count),
    rows.length,
  );
});

const speciesChartData = computed<ChartDatum[]>(() => {
  const rows = dashboardStore.characters;
  return toChartData(
    Array.from(groupBy(rows, (r) => r.species.trim() || 'Unknown').entries())
      .map(([l, c]) => ({ label: l, count: c }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    rows.length,
  );
});

const onTextFilterChange = (
  key: 'name' | 'species' | 'type' | 'originName' | 'locationName',
  value: string | number | null,
) => dashboardStore.updateFilters({ [key]: value ? String(value) : '' });

const onNumberFilterChange = (key: 'status' | 'gender', value: number | null) =>
  dashboardStore.updateFilters({ [key]: value });

const parseEpisodeField = (value: string | number | null): number | '' => {
  if (value === null || value === '') return '';
  const parsed = Number(value);
  return !Number.isInteger(parsed) || parsed < 0 ? '' : parsed;
};

const onEpisodeFilterChange = (
  key: 'episodeCountMin' | 'episodeCountMax',
  value: string | number | null,
) => dashboardStore.updateFilters({ [key]: parseEpisodeField(value) });

const onSortByChange = (value: string | null) =>
  dashboardStore.updateFilters({ sortBy: value ?? 'externalId' });
const onSortOrderChange = (value: string | null) => {
  if (value === 'ASC' || value === 'DESC') dashboardStore.updateFilters({ sortOrder: value });
};
const onLimitChange = (value: number | null) =>
  dashboardStore.updateFilters({ limit: value ?? 20 });
const onPageChange = (value: number) => dashboardStore.setPage(value);
const clearAllFilters = () => dashboardStore.resetFilters();

const refreshCharacters = () => {
  dashboardStore.clearCharactersCache();
  void dashboardStore.loadCharacters({ force: true });
};
const refreshSyncStatus = () => {
  dashboardStore.clearSyncStatusCache();
  void dashboardStore.loadSyncStatus({ force: true });
};

const isSameQuery = (a: LocationQueryRaw, b: LocationQuery) =>
  JSON.stringify(a) === JSON.stringify(b);

const runDebouncedLoad = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void dashboardStore.loadCharacters();
  }, 500);
};

watch(
  () => route.query,
  (q) => {
    dashboardStore.hydrateFiltersFromQuery(q);
  },
  { immediate: true },
);

watch(
  () => dashboardStore.activeQuery,
  (activeQuery) => {
    if (!isSameQuery(activeQuery, route.query)) void router.replace({ query: activeQuery });
    runDebouncedLoad();
  },
  { deep: true },
);

onMounted(() => {
  void dashboardStore.loadSyncStatus();
  runDebouncedLoad();
});

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data inválida';
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
</script>

<style scoped>
.dashboard-page {
  background: #f9fafb;
  min-height: 100%;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 24px 48px;
}

/* Page header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0;
}

.ext-link {
  color: #2563eb;
  text-decoration: none;
}
.ext-link:hover {
  text-decoration: underline;
}

.page-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Banners */
.error-banner {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.warning-banner {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 8px;
}

@media (max-width: 599px) {
  .dashboard-container {
    padding: 16px 12px 32px;
  }
  .page-actions {
    width: 100%;
  }
  .page-actions .q-btn {
    flex: 1;
  }
}
</style>
