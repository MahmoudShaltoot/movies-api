import { Controller, Get, Post, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { MovieUserRatingDto } from './dto/movie-user-rating.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateMoviesUsersRatingDto } from './dto/create-movies-users-rating.dto';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';

@Controller('movie')
export class MoviesUsersRatingController {
  constructor(private readonly moviesUsersRatingService: MoviesUsersRatingService) { }

  @UseGuards(AuthGuard)
  @Post(':movie_id/rate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rating for a movie by a user' })
  @ApiParam({ name: 'movie_id', type: Number, description: 'ID of the movie to rate' })
  @ApiBody({ description: 'Data to create a new rating', type: CreateMoviesUsersRatingDto })
  @ApiResponse({ status: 201, description: 'Rating created successfully', type: MoviesUsersRating })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Param('movie_id') movie_id: string, @Body() createMoviesUsersRatingDto: MovieUserRatingDto, @Req() request) {
    return this.moviesUsersRatingService.create({
      rating: createMoviesUsersRatingDto.rating,
      user_id: request.user.id,
      movie_id: +movie_id
    });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all movie ratings with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of ratings per page', example: 10 })
  @ApiResponse({ status: 200, description: 'List of ratings retrieved successfully', type: [MoviesUsersRating] })
  findAll(@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    return this.moviesUsersRatingService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific movie rating by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the rating to retrieve' })
  @ApiResponse({ status: 200, description: 'Rating retrieved successfully', type: MoviesUsersRating })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  findOne(@Param('id') id: string) {
    return this.moviesUsersRatingService.findOne(+id);
  }
}
