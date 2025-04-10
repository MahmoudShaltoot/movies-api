import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { GenresModule } from './genres/genres.module';
import { TmdbService } from './tmdb/tmdb.service';
import { TmdbModule } from './tmdb/tmdb.module';
import { HttpModule } from '@nestjs/axios';
import { MoviesModule } from './movies/movies.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis/redis.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MoviesUsersRatingModule } from './movies-users-rating/movies-users-rating.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { WatchlistModule } from './watchlist/watchlist.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations]
    }),
      TypeOrmModule.forRoot(dataSourceOptions),
      CacheModule.register({isGlobal: true}),
      ScheduleModule.forRoot(),
      EventEmitterModule.forRoot(),
      GenresModule,
      TmdbModule,
      HttpModule,
      MoviesModule,
      UsersModule,
      AuthModule,
      MoviesUsersRatingModule,
      WatchlistModule,
      RedisModule
    ],
  controllers: [AppController],
  providers: [AppService, TmdbService, RedisService],
})
export class AppModule {}
