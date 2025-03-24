import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

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
}
