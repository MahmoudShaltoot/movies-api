import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import Bottleneck from 'bottleneck';
import { RedisService } from 'src/redis/redis.service';
import * as _ from 'lodash'
import { ClientProxy } from '@nestjs/microservices';

// Number of pages to fetch, default = 10 pages to avoid overwhelming TMDB quota  
const MAX_PAGES_TO_FETCH = process.env.MAX_PAGES_TO_FETCH === "Infinity"
  ? Infinity
  : parseInt(process.env.MAX_PAGES_TO_FETCH || '10', 10);

// Rate limiter (e.g., 5 requests per second)
const limiter = new Bottleneck({
  maxConcurrent: parseInt(process.env.TMDB_MAX_CONCURRENT || '1', 10), // Number of concurrent requests, default = 1
  minTime: parseInt(process.env.TMDB_MIN_TIME || '200', 10),     // Minimum time (ms) between requests (200ms = 5 requests/sec)
});

@Injectable()
export class TmdbService {
  private readonly apiUrl;
  private readonly apiKey;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @Inject('RABBITMQ_SERVICE') private readonly clientProxy: ClientProxy,
  ) {
    this.apiUrl = configService.get<string>('TMDB_API_URL');
    this.apiKey = configService.get<string>('TMDB_API_KEY');
  }

  async syncTMDBmovies() {
    let pageDate: TmdbResponse, page = 0;
    do {
      await limiter.schedule(async () => {
        page++; // starting page is page one

        pageDate = await this.getPopularMovies(page);

        pageDate.results.forEach(async movie => {
          const isExist = await this.redisService.iskeyExist(`movie_${movie.id}`)
          if (!isExist) {
            await this.redisService.setHashKey(
              `movie_${movie.id}`,
              _.pick(movie, ['id', 'title', 'original_title', 'original_language', 'poster_path', 'genre_ids']))

            this.clientProxy.emit('new-movie', movie);
          } else {
            console.log(`Movie "${movie.title}" already exist, external_id: ${movie.id}`);
          }
        });
      })
      // @ts-ignore
    } while (pageDate.results.length > 0 && (page < MAX_PAGES_TO_FETCH))
  }

  async getPopularMovies(page: number = 1): Promise<TmdbResponse> {
    const url = `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&page=${page}&sort_by=popularity.desc`;
    return (await firstValueFrom(this.httpService.get(url))).data;
  }

  async getGenres() {
    return (
      await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/genre/movie/list?language=en`, {
          params: { api_key: this.apiKey },
        }))).data.genres
  }
}
