import { Injectable } from '@nestjs/common';
import { CreateMoviesUsersRatingDto } from './dto/create-movies-users-rating.dto';
import { UpdateMoviesUsersRatingDto } from './dto/update-movies-users-rating.dto';

@Injectable()
export class MoviesUsersRatingService {
  create(createMoviesUsersRatingDto: CreateMoviesUsersRatingDto) {
    return 'This action adds a new moviesUsersRating';
  }

  findAll() {
    return `This action returns all moviesUsersRating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} moviesUsersRating`;
  }

  update(id: number, updateMoviesUsersRatingDto: UpdateMoviesUsersRatingDto) {
    return `This action updates a #${id} moviesUsersRating`;
  }

  remove(id: number) {
    return `This action removes a #${id} moviesUsersRating`;
  }
}
