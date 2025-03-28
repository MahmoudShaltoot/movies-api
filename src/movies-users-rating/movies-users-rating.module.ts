import { Module } from '@nestjs/common';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { MoviesUsersRatingController } from './movies-users-rating.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { MoviesService } from 'src/movies/movies.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [TypeOrmModule.forFeature([MoviesUsersRating, User, Movie])],
  controllers: [MoviesUsersRatingController],
  providers: [MoviesUsersRatingService, JwtService, UsersService, MoviesService, EventEmitter2],
})
export class MoviesUsersRatingModule {}
