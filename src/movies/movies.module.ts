import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieConsumer } from './consumer/movie.consumer';
import { JwtService } from '@nestjs/jwt';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])],
  controllers: [MoviesController, MovieConsumer],
  providers: [MoviesService, GenresService, JwtService],
})
export class MoviesModule {}
