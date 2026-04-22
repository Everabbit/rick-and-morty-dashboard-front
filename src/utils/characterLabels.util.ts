import { CharacterGender, CharacterStatus } from 'src/enums/characters.enum';

export const characterStatusLabelMap: Record<CharacterStatus, string> = {
  [CharacterStatus.ALIVE]: 'Alive',
  [CharacterStatus.DEAD]: 'Dead',
  [CharacterStatus.UNKNOWN]: 'Unknown',
};

export const characterGenderLabelMap: Record<CharacterGender, string> = {
  [CharacterGender.FEMALE]: 'Female',
  [CharacterGender.MALE]: 'Male',
  [CharacterGender.GENDERLESS]: 'Genderless',
  [CharacterGender.UNKNOWN]: 'Unknown',
};

export const getCharacterStatusLabel = (status: CharacterStatus): string => {
  return characterStatusLabelMap[status] ?? 'Unknown';
};

export const getCharacterGenderLabel = (gender: CharacterGender): string => {
  return characterGenderLabelMap[gender] ?? 'Unknown';
};

export const characterStatusOptions = Object.entries(characterStatusLabelMap).map(
  ([value, label]) => ({
    value: Number(value),
    label,
  }),
);

export const characterGenderOptions = Object.entries(characterGenderLabelMap).map(
  ([value, label]) => ({
    value: Number(value),
    label,
  }),
);
