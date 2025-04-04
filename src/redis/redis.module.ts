import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          username: process.env.REDIS_USERNAME || 'default',
          password: process.env.REDIS_PASSWORD || 'password',
          db: parseInt(process.env.REDIS_DATABASE_INDEX || '0', 10),
        })
      }
    }
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule { }
