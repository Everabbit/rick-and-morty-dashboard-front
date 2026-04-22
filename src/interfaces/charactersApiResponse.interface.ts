import type { Character } from './character.interface';
import type { Filters, SortOrder } from './characterFilters.interface';
import type { PaginationInfo } from './pagination.interface';

export interface CharactersApiResponse {
  pagination: PaginationInfo;
  appliedFilters: Partial<Filters> & {
    sortBy: string;
    sortOrder: SortOrder;
  };
  data: Character[];
}
