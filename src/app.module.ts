import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { GenresModule } from './genres/genres.module';
import { TmdbService } from './tmdb/tmdb.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations]
    }),
      TypeOrmModule.forRoot(dataSourceOptions),
      GenresModule
    ],
  controllers: [AppController],
  providers: [AppService, TmdbService],
})
export class AppModule {}
