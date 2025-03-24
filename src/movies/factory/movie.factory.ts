import { Movie } from "../entities/movie.entity";

export const createMovie = (overrides?: Partial<Movie>): Partial<Movie> => {
  return {
    id: Math.floor(Math.random() * 1000),
    external_id: Math.floor(Math.random() * 1000),
    title: "Intersteller",
    original_title: "Intersteller",
    original_language: "en",
    release_date: "2030-06-06",
    poster_path: "poster.jpg",
    overview: "A team of researchers, to find a new planet for humans",
    genre_ids: [1, 2, 3],
    vote_count: 100,
    average_rating: 9.5,
    ...overrides, // Overriding default properties
  };
};
