import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { CreateMoviesUsersRatingDto } from './dto/create-movies-users-rating.dto';
import { UpdateMoviesUsersRatingDto } from './dto/update-movies-users-rating.dto';
import { MovieUserRatingDto } from './dto/movie-user-rating.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('movie')
export class MoviesUsersRatingController {
  constructor(private readonly moviesUsersRatingService: MoviesUsersRatingService) { }

  @UseGuards(AuthGuard)
  @Post(':movie_id/rate')
  create(@Param('movie_id') movie_id: string, @Body() createMoviesUsersRatingDto: MovieUserRatingDto, @Req() request) {
    return this.moviesUsersRatingService.create({
      rating: createMoviesUsersRatingDto.rating,
      user_id: request.user.id,
      movie_id: +movie_id
    });
  }

  @Get()
  findAll(@Query('page') page: number = 0, @Query('pageSize') pageSize: number = 10) {
    return this.moviesUsersRatingService.findAll(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesUsersRatingService.findOne(+id);
  }
}
