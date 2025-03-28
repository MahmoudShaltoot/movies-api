import { Module } from '@nestjs/common';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { MoviesUsersRatingController } from './movies-users-rating.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { MoviesService } from 'src/movies/movies.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { UserRateMovieEventHandler } from 'src/handler/event-handler/user-rate-movie..handler';

@Module({
  imports: [TypeOrmModule.forFeature([MoviesUsersRating, User, Movie])],
  controllers: [MoviesUsersRatingController],
  providers: [MoviesUsersRatingService, JwtService, UsersService, MoviesService, UserRateMovieEventHandler],
})
export class MoviesUsersRatingModule {}
