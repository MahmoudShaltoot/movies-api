import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  findAll() {
  }

  findOne(id: number) {
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
  }

  remove(id: number) {
  }
}
