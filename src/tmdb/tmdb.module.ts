import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
    imports: [HttpModule],
    providers: [TmdbService, RedisService],
    exports: [TmdbService],
})
export class TmdbModule {}
