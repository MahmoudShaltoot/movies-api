export interface TmdbMovie {
  id: number,
  backdrop_path: string,
  genre_ids: number[]
  title: string,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  release_date: string,
  video: boolean,
  adult: boolean,
  vote_average: number,
  vote_count: number
}

export interface TmdbResponse {
  page: number,
  results: TmdbMovie[],
  total_pages: number,
  total_results: number
}
