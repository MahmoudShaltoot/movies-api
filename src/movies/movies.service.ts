import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as _ from 'lodash'
import { TmdbMovie } from '../tmdb/interface/tmdb.interface';
import { GenresService } from '../genres/genres.service';
@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly genreService: GenresService
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

  async findAll(filters: Record<string, any>): Promise<Movie[]> {    
    const queryBuilder = this.movieRepository.createQueryBuilder('movie');

    if (filters.title) {
      queryBuilder.andWhere('movie.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters.genre) {
      const genresFilter = JSON.parse(filters.genre);
      const genres = await this.genreService.findByNames(genresFilter)      
      queryBuilder.andWhere('movie.genre_ids && ARRAY[:...genres]::int[]', { genres });
    }
    if (filters.release_date) {
      queryBuilder.andWhere('movie.release_date = :release_date', { release_date: filters.release_date });
    }
    if (filters.sortBy === 'average_rating') {
      const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
      queryBuilder.orderBy('movie.average_rating', sortOrder);
    }
    
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOneBy({ id })
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: Partial<UpdateMovieDto>): Promise<UpdateResult> {
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
      const roundedAvgRating = parseFloat(newAvgRating.toFixed(2));

      await queryRunner.manager.update(Movie, movie_id, {
        vote_count: newMovieCount,
        average_rating: roundedAvgRating,
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
