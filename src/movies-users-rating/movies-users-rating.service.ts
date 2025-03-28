import { Injectable, Req } from '@nestjs/common';
import { CreateMoviesUsersRatingDto } from './dto/create-movies-users-rating.dto';
import { UpdateMoviesUsersRatingDto } from './dto/update-movies-users-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { Repository } from 'typeorm';
import { MoviesService } from 'src/movies/movies.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MoviesUsersRatingService {
  constructor(
    @InjectRepository(MoviesUsersRating)
    private readonly usersRatingRepo: Repository<MoviesUsersRating>,
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
  ) { }
  async create(createMoviesUsersRatingDto: CreateMoviesUsersRatingDto) {
    const user = await this.usersService.findOneby({ id: createMoviesUsersRatingDto.user_id });
    delete user.password;

    const movie = await this.moviesService.findOne(createMoviesUsersRatingDto.movie_id);

    const createdRating = this.usersRatingRepo.create({
      rating: createMoviesUsersRatingDto.rating,
      user: user,
      movie: movie
    });
    return await this.usersRatingRepo.save(createdRating);
  }

  async findAll(page: number, page_size: number) {
    return await this.usersRatingRepo.find({ skip: page * page_size, take: page_size });
  }

  async findOne(id: number) {
    return this.usersRatingRepo.findBy({ id });
  }
}
