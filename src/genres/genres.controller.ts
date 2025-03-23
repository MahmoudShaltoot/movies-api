import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/genre.dto';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genresService.createGenre(createGenreDto);
  }

  @Get()
  async findAll(): Promise<Genre[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Genre> {
    return this.genresService.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    return this.genresService.deleteById(id);
  }
}
