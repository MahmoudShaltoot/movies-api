import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      username: this.configService.get<string>('REDIS_USERNAME'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DATABASE_INDEX')
    });
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

  async getHashKey(key: string): Promise<{ [key: string]: string }> {
    const result = await this.redis.hgetall(key);
    if (result.genres) {
      result.genres = JSON.parse(result.genres);
    }
    return result;
  }

  async iskeyExist(key: string) {
    return this.redis.exists(key)
  }
}


