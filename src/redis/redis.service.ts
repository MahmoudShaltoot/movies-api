import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis) {
  }

  async setHashKey(key: string, value: { id: number, title: string; original_title: string; original_language: string, poster_path: string; genre_ids: number[] }): Promise<void> {
    await this.redis.hmset(key, {
      external_id: value.id,
      title: value.title,
      original_title: value.original_title,
      original_language: value.original_language,
      poster_path: value.poster_path,
      genre_ids: JSON.stringify(value.genre_ids),
    });
  }

  async iskeyExist(key: string) {
    return this.redis.exists(key)
  }
}
