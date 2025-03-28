import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as _ from 'lodash'
@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) { }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const isExist = await this.movieRepository.findOne({
      where: [
        { title: createMovieDto.title },
        { original_title: createMovieDto.original_language },
        { poster_path: createMovieDto.poster_path }
      ]
    })
    if (isExist) {
      throw new ConflictException('Movie already exist, Please check [ "Title" , "original_title" and "poster_path"')
    }
    const movie = await this.movieRepository.create(createMovieDto)
    return this.movieRepository.save(movie)
  }

  async saveMovieMessage(message: TmdbMovie): Promise<Movie> {
    console.log('creating new movie for message:', message);

    const isExist = await this.movieRepository.findOne({
      where: [
        { external_id: message.id },
        { title: message.title },
        { original_title: message.original_language }]
    });
    if (isExist) {
      throw new ConflictException(`Movie already exists, please check if a movie with title:${message.title} or original_title: ${message.original_title} exist`);
    }
    const movieToCreate = _.pick(message, ['title', 'original_title', 'original_language', 'poster_path', 'genre_ids', 'release_date',
      'overview',
    ]);

    const movie = this.movieRepository.create({ ...movieToCreate, external_id: message.id });
    return this.movieRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find()
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOneBy({ id })
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<UpdateResult> {
    const movie = await this.movieRepository.findOneBy({ id })
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return this.movieRepository.update({ id }, updateMovieDto)
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.movieRepository.delete({ id })
  }

  async updateMovieRating(movie_id: number, newRating: number) {
    const queryRunner = this.movieRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movie = await queryRunner.manager.findOne(Movie, {
        where: { id: movie_id },
        lock: { mode: 'pessimistic_write' }, // Lock the record for writing
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movie_id} not found`);
      }

      const newMovieCount = movie.vote_count + 1;
      const newAvgRating = (movie.average_rating * movie.vote_count + newRating) / newMovieCount;

      await queryRunner.manager.update(Movie, movie_id, {
        vote_count: newMovieCount,
        average_rating: newAvgRating,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
