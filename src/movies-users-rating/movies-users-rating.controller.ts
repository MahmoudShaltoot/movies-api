import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { CreateMoviesUsersRatingDto } from './dto/create-movies-users-rating.dto';
import { UpdateMoviesUsersRatingDto } from './dto/update-movies-users-rating.dto';

@Controller('movies-users-rating')
export class MoviesUsersRatingController {
  constructor(private readonly moviesUsersRatingService: MoviesUsersRatingService) {}

  @Post()
  create(@Body() createMoviesUsersRatingDto: CreateMoviesUsersRatingDto) {
    return this.moviesUsersRatingService.create(createMoviesUsersRatingDto);
  }

  @Get()
  findAll() {
    return this.moviesUsersRatingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesUsersRatingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMoviesUsersRatingDto: UpdateMoviesUsersRatingDto) {
    return this.moviesUsersRatingService.update(+id, updateMoviesUsersRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesUsersRatingService.remove(+id);
  }
}
