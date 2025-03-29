import { Module } from '@nestjs/common';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { MoviesUsersRatingController } from './movies-users-rating.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { UserRateMovieEventHandler } from '../handler/event-handler/user-rate-movie..handler';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoviesUsersRating, User, Movie, Genre])],
  controllers: [MoviesUsersRatingController],
  providers: [MoviesUsersRatingService, JwtService, UsersService, GenresService, MoviesService, UserRateMovieEventHandler],
})
export class MoviesUsersRatingModule {}
