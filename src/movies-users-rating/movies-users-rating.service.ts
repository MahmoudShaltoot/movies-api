import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMoviesUsersRatingDto } from './dto/create-movies-users-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { Repository } from 'typeorm';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MoviesUsersRatingService {
  constructor(
    @InjectRepository(MoviesUsersRating)
    private readonly usersRatingRepo: Repository<MoviesUsersRating>,
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) { }
  async create(createMoviesUsersRatingDto: CreateMoviesUsersRatingDto) {
    const user = await this.usersService.findOneby({ id: createMoviesUsersRatingDto.user_id });
    if(!user) throw new NotFoundException('User not found');
    delete user.password;

    const movie = await this.moviesService.findOne(createMoviesUsersRatingDto.movie_id);

    const rating = this.usersRatingRepo.create({
      rating: createMoviesUsersRatingDto.rating,
      user: user,
      movie: movie
    });
    const createdRating = await this.usersRatingRepo.save(rating);

    this.eventEmitter.emitAsync('USER_RATE_MOVIE', { movie_id: createdRating.movie.id, newRating: createdRating.rating})

    return createdRating;
  }

  async findAll(page: number, page_size: number) {
    return await this.usersRatingRepo.find({ skip: page * page_size, take: page_size });
  }

  async findOne(id: number) {
    return this.usersRatingRepo.findBy({ id });
  }
}
