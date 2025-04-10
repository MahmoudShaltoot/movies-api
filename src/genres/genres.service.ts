import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async createGenre(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  async findAll(): Promise<Genre[]> {
    return this.genreRepository.find();
  }

  async findById(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
        throw new NotFoundException()
    }
    return genre;
  }

  async findByNames(genre: string[]): Promise<number[]> {
    const genres = await this.genreRepository
    .createQueryBuilder('genre')
    .where('genre.name IN (:...genreNames)', { genreNames: genre })
    .select('genre.external_id')
    .getMany();

    return genres.map(genre => genre.external_id);
  }

  async deleteById(id: number) {    
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
        throw new NotFoundException()
    }
    return this.genreRepository.delete(genre.id);
  }
}