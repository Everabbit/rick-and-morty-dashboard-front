import type { CharacterGender, CharacterStatus } from 'src/enums/characters.enum';

export type SortOrder = 'ASC' | 'DESC';

export interface Filters {
  name: string;
  status: CharacterStatus | null;
  species: string;
  gender: CharacterGender | null;
  originName: string;
  locationName: string;
  type: string;
  episodeCountMin: number | '';
  episodeCountMax: number | '';
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export type CharacterQueryParams = Partial<Filters>;
