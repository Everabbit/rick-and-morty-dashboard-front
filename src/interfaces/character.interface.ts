import type { CharacterGender, CharacterStatus } from 'src/enums/characters.enum';

export interface Character {
  id: number;
  externalId: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  originName: string;
  locationName: string;
  image: string;
  episodeCount: number;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}
