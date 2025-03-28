import { Module } from '@nestjs/common';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { MoviesUsersRatingController } from './movies-users-rating.controller';

@Module({
  controllers: [MoviesUsersRatingController],
  providers: [MoviesUsersRatingService],
})
export class MoviesUsersRatingModule {}
