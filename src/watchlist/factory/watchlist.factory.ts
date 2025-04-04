import { User } from "../../users/entities/user.entity";
import { Watchlist } from "../entities/watchlist.entity";
import { Movie } from "../../movies/entities/movie.entity";

export const createUser = (overrides = {}): User => ({
  id: Math.floor(Math.random() * 1000),
  full_name: "John Doe",
  username: "johndoe",
  is_admin: false,
  created_at: new Date(),
  updated_at: new Date(),
  ratings: [],
  watchlists: [],
  ...overrides
});

export const createMovie = (overrides = {}): Movie => ({
  id: Math.floor(Math.random() * 1000),
  title: "Sample Movie",
  original_title: "Sample Movie Original",
  poster_path: "/sample.jpg",
  overview: "This is a sample movie overview.",
  original_language: "en",
  release_date: "2023-01-01",
  external_id: 10,
  vote_count: 100,
  average_rating: 8.5,
  watchlists: [],
  ratings: [],
  ...overrides
});

export const createWatchlist = (overrides = {}): Watchlist => ({
  id: 1,
  user: createUser(),
  movie: createMovie(),
  ...overrides,
});
