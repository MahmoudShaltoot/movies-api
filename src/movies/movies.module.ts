import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieConsumer } from './consumer/movie.consumer';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]),],
  controllers: [MoviesController, MovieConsumer],
  providers: [MoviesService, JwtService],
})
export class MoviesModule {}
