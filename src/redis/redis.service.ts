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

  async setHashKey(key: string, value: { id: number, external_id: number; title: string; original_title: string; poster: string; genres: string[] }): Promise<void> {
    await this.redis.hmset(key, {
      external_id: value.external_id,
      title: value.title,
      original_title: value.original_title,
      poster: value.poster,
      genres: JSON.stringify(value.genres),
    });
  }

  async getHashKey(key: string): Promise<{ [key: string]: string }> {
    const result = await this.redis.hgetall(key);
    if (result.genres) {
      result.genres = JSON.parse(result.genres);
    }
    return result;
  }
}


