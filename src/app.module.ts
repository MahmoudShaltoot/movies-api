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
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations]
    }),
      TypeOrmModule.forRoot(dataSourceOptions),
      CacheModule.register({isGlobal: true}),
      GenresModule,
      TmdbModule,
      HttpModule,
      MoviesModule,
      UserModule,
      AuthModule
    ],
  controllers: [AppController],
  providers: [AppService, TmdbService, RedisService],
})
export class AppModule {}
