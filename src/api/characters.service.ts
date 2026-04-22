import type {
  CharacterQueryParams,
  Filters,
} from 'src/interfaces/characterFilters.interface';
import type { CharactersApiResponse } from 'src/interfaces/charactersApiResponse.interface';
import type { SyncStatusResponse } from 'src/interfaces/syncStatus.interface';
import { api } from 'boot/axios';

const normalizeParams = (
  params: CharacterQueryParams,
): Record<string, string | number> => {
  const normalized: Record<string, string | number> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      normalized[key] = trimmed;
      return;
    }

    normalized[key] = value;
  });

  return normalized;
};

export async function fetchCharacters(
  params: Partial<Filters>,
): Promise<CharactersApiResponse> {
  const response = await api.get<CharactersApiResponse>('/characters', {
    params: normalizeParams(params),
  });

  return response.data;
}

export async function fetchSyncStatus(): Promise<SyncStatusResponse> {
  const response = await api.get<SyncStatusResponse>('/sync/status');
  return response.data;
}
