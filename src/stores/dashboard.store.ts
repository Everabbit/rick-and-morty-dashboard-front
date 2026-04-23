import { defineStore } from 'pinia';
import type { LocationQuery, LocationQueryRaw } from 'vue-router';
import { CharacterGender, CharacterStatus } from 'src/enums/characters.enum';
import { fetchCharacters, fetchSyncStatus } from 'src/api/characters.service';
import type { Character } from 'src/interfaces/character.interface';
import type { Filters } from 'src/interfaces/characterFilters.interface';
import type { PaginationInfo } from 'src/interfaces/pagination.interface';
import type { SyncStatusResponse } from 'src/interfaces/syncStatus.interface';
import type { CharactersApiResponse } from 'src/interfaces/charactersApiResponse.interface';

const DEFAULT_FILTERS: Filters = {
  name: '',
  status: null,
  species: '',
  gender: null,
  originName: '',
  locationName: '',
  type: '',
  episodeCountMin: '',
  episodeCountMax: '',
  page: 1,
  limit: 20,
  sortBy: 'externalId',
  sortOrder: 'ASC',
};

const DEFAULT_PAGINATION: PaginationInfo = {
  page: 1,
  limit: 20,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const STATUS_VALUES = new Set<number>([
  CharacterStatus.ALIVE,
  CharacterStatus.DEAD,
  CharacterStatus.UNKNOWN,
]);

const GENDER_VALUES = new Set<number>([
  CharacterGender.FEMALE,
  CharacterGender.MALE,
  CharacterGender.GENDERLESS,
  CharacterGender.UNKNOWN,
]);

const SORT_ORDER_VALUES = new Set(['ASC', 'DESC']);

const SORT_BY_VALUES = new Set<string>([
  'externalId',
  'name',
  'status',
  'species',
  'gender',
  'originName',
  'locationName',
  'type',
  'episodeCount',
  'lastSyncedAt',
  'updatedAt',
]);

const toSingleQueryValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }

  return undefined;
};

const parsePositiveInteger = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const parseNonNegativeInteger = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
};

const parseEnum = <T extends number>(
  value: string | undefined,
  allowedValues: Set<T>,
): T | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return undefined;
  }

  if (!allowedValues.has(parsed as T)) {
    return undefined;
  }

  return parsed as T;
};

const parseSortOrder = (value: string | undefined): Filters['sortOrder'] | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.toUpperCase();
  if (!SORT_ORDER_VALUES.has(normalized)) {
    return undefined;
  }

  return normalized === 'ASC' ? 'ASC' : 'DESC';
};

const isDifferentQuery = (queryA: LocationQueryRaw, queryB: LocationQueryRaw): boolean => {
  const normalizedA = JSON.stringify(queryA);
  const normalizedB = JSON.stringify(queryB);
  return normalizedA !== normalizedB;
};

interface DashboardState {
  filters: Filters;
  characters: Character[];
  pagination: PaginationInfo;
  appliedFilters: Partial<Filters>;
  syncStatus: SyncStatusResponse | null;
  isLoadingCharacters: boolean;
  isLoadingSyncStatus: boolean;
  charactersError: string | null;
  syncStatusError: string | null;
  charactersCache: Map<string, CharactersApiResponse>;
  syncStatusCache: SyncStatusResponse | null;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    filters: { ...DEFAULT_FILTERS },
    characters: [],
    pagination: { ...DEFAULT_PAGINATION },
    appliedFilters: {},
    syncStatus: null,
    isLoadingCharacters: false,
    isLoadingSyncStatus: false,
    charactersError: null,
    syncStatusError: null,
    charactersCache: new Map<string, CharactersApiResponse>(),
    syncStatusCache: null,
  }),

  getters: {
    activeQuery(state): LocationQueryRaw {
      const query: LocationQueryRaw = {};

      if (state.filters.name.trim()) {
        query.name = state.filters.name.trim();
      }

      if (state.filters.status !== null) {
        query.status = String(state.filters.status);
      }

      if (state.filters.species.trim()) {
        query.species = state.filters.species.trim();
      }

      if (state.filters.gender !== null) {
        query.gender = String(state.filters.gender);
      }

      if (state.filters.originName.trim()) {
        query.originName = state.filters.originName.trim();
      }

      if (state.filters.locationName.trim()) {
        query.locationName = state.filters.locationName.trim();
      }

      if (state.filters.type.trim()) {
        query.type = state.filters.type.trim();
      }

      if (state.filters.episodeCountMin !== '') {
        query.episodeCountMin = String(state.filters.episodeCountMin);
      }

      if (state.filters.episodeCountMax !== '') {
        query.episodeCountMax = String(state.filters.episodeCountMax);
      }

      if (state.filters.page !== DEFAULT_FILTERS.page) {
        query.page = String(state.filters.page);
      }

      if (state.filters.limit !== DEFAULT_FILTERS.limit) {
        query.limit = String(state.filters.limit);
      }

      if (state.filters.sortBy !== DEFAULT_FILTERS.sortBy) {
        query.sortBy = state.filters.sortBy;
      }

      if (state.filters.sortOrder !== DEFAULT_FILTERS.sortOrder) {
        query.sortOrder = state.filters.sortOrder;
      }

      return query;
    },
  },

  actions: {
    resetFilters(): void {
      this.filters = {
        ...DEFAULT_FILTERS,
      };
    },

    hydrateFiltersFromQuery(query: LocationQuery): void {
      const nextFilters: Filters = {
        ...DEFAULT_FILTERS,
      };

      const name = toSingleQueryValue(query.name);
      if (name) {
        nextFilters.name = name;
      }

      const status = parseEnum(toSingleQueryValue(query.status), STATUS_VALUES);
      if (status !== undefined) {
        nextFilters.status = status;
      }

      const species = toSingleQueryValue(query.species);
      if (species) {
        nextFilters.species = species;
      }

      const gender = parseEnum(toSingleQueryValue(query.gender), GENDER_VALUES);
      if (gender !== undefined) {
        nextFilters.gender = gender;
      }

      const originName = toSingleQueryValue(query.originName);
      if (originName) {
        nextFilters.originName = originName;
      }

      const locationName = toSingleQueryValue(query.locationName);
      if (locationName) {
        nextFilters.locationName = locationName;
      }

      const type = toSingleQueryValue(query.type);
      if (type) {
        nextFilters.type = type;
      }

      const episodeCountMin = parseNonNegativeInteger(toSingleQueryValue(query.episodeCountMin));
      if (episodeCountMin !== undefined) {
        nextFilters.episodeCountMin = episodeCountMin;
      }

      const episodeCountMax = parseNonNegativeInteger(toSingleQueryValue(query.episodeCountMax));
      if (episodeCountMax !== undefined) {
        nextFilters.episodeCountMax = episodeCountMax;
      }

      const page = parsePositiveInteger(toSingleQueryValue(query.page));
      if (page !== undefined) {
        nextFilters.page = page;
      }

      const limit = parsePositiveInteger(toSingleQueryValue(query.limit));
      if (limit !== undefined) {
        nextFilters.limit = limit;
      }

      const sortBy = toSingleQueryValue(query.sortBy);
      if (sortBy && SORT_BY_VALUES.has(sortBy)) {
        nextFilters.sortBy = sortBy;
      }

      const sortOrder = parseSortOrder(toSingleQueryValue(query.sortOrder));
      if (sortOrder) {
        nextFilters.sortOrder = sortOrder;
      }

      this.filters = nextFilters;
    },

    updateFilters(partial: Partial<Filters>): void {
      const filterKeysThatResetPage: (keyof Filters)[] = [
        'name',
        'status',
        'species',
        'gender',
        'originName',
        'locationName',
        'type',
        'episodeCountMin',
        'episodeCountMax',
        'sortBy',
        'sortOrder',
        'limit',
      ];

      const shouldResetPage = filterKeysThatResetPage.some((key) => key in partial);

      this.filters = {
        ...this.filters,
        ...partial,
      };

      if (shouldResetPage) {
        this.filters.page = 1;
      }
    },

    setPage(page: number): void {
      this.filters.page = page;
    },

    async loadCharacters(options?: { force?: boolean }): Promise<void> {
      const cacheKey = JSON.stringify(this.activeQuery);
      const shouldUseCache = !options?.force;

      if (shouldUseCache) {
        const cached = this.charactersCache.get(cacheKey);
        if (cached) {
          this.characters = cached.data;
          this.pagination = cached.pagination;
          this.appliedFilters = cached.appliedFilters;
          this.charactersError = null;
          return;
        }
      }

      this.isLoadingCharacters = true;
      this.charactersError = null;

      try {
        const response = await fetchCharacters(this.filters);
        this.characters = response.data;
        this.pagination = response.pagination;
        this.appliedFilters = response.appliedFilters;
        this.charactersCache.set(cacheKey, response);
      } catch (error: unknown) {
        this.charactersError = error instanceof Error ? error.message : 'Failed to load characters';
      } finally {
        this.isLoadingCharacters = false;
      }
    },

    async loadSyncStatus(options?: { force?: boolean }): Promise<void> {
      const shouldUseCache = !options?.force;

      if (shouldUseCache && this.syncStatusCache) {
        this.syncStatus = this.syncStatusCache;
        this.syncStatusError = null;
        return;
      }

      this.isLoadingSyncStatus = true;
      this.syncStatusError = null;

      try {
        const response = await fetchSyncStatus();
        this.syncStatus = response;
        this.syncStatusCache = response;
      } catch (error: unknown) {
        this.syncStatusError =
          error instanceof Error ? error.message : 'Failed to load sync status';
      } finally {
        this.isLoadingSyncStatus = false;
      }
    },

    clearCharactersCache(): void {
      this.charactersCache.clear();
    },

    clearSyncStatusCache(): void {
      this.syncStatusCache = null;
    },

    syncQueryToRouter(
      routerReplace: (query: LocationQueryRaw) => Promise<void> | void,
      currentQuery: LocationQueryRaw,
    ): void {
      if (!isDifferentQuery(this.activeQuery, currentQuery)) {
        return;
      }

      void routerReplace(this.activeQuery);
    },
  },
});
