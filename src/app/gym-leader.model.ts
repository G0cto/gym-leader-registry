
export const REGIONS = ['Kanto', 'Johto', 'Hoenn'] as const;

export const POKEMON_TYPES = [
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Rock',
  'Ground',
  'Steel',
  'Fairy',
  'Bug',
  'Flying',
  'Fighting',
  'Ghost',
  'Psychic',
  'Poison',
  'Dragon'
] as const;

export interface GymLeader {
  _id?: string;
  name: string;
  region: string;
  town: string;
  badge: string;
  specialty: string;
  aceLevel: number;
}

export interface DeleteResponse {
  message: string;
}
