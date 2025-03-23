import { Genre } from "../entities/genre.entity";

const GENRES = ['Action', 'Adventure', 'Comedy', 'Animation']

export const createGenre = (overrides?: Partial<Genre>): Partial<Genre> => {
  return {
    id: Math.floor(Math.random() * 1000),
    external_id: Math.floor(Math.random() * 1000),
    name: GENRES[Math.floor(Math.random() * GENRES.length)],
    ...overrides, // Overriding default properties
  };
};
