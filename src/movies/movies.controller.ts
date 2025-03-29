import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AdminGuard } from '../guards/admin.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiBody({ description: 'Data to create a new movie', type: CreateMovieDto })
  @ApiResponse({ status: 201, description: 'Movie created successfully', type: Movie })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can create movies' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all movies with optional filters' })
  @ApiQuery({ name: 'filters', required: false, description: 'Optional filters for movies', 
    schema: {
    type: 'object',
    properties: {
      title: { type: 'string', example: 'Inception' },
      genre: { type: 'array', items: { type: 'string' }, example: ['Action', 'Drama'] },
      release_date: { type: 'string', format: 'date', example: '2023-01-01' },
      sortBy: { type: 'string', enum: ['average_rating'], example: 'average_rating' },
      sortOrder: { type: 'string', enum: ['asc', 'desc'], example: 'asc' },
      page: { type: 'integer', example: 1 },
      limit: { type: 'integer', example: 10 },
    },
  }})
  @ApiResponse({ status: 200, description: 'List of movies retrieved successfully', type: [Movie] })
  findAll(@Query() filters: Record<string, any>) {
    return this.moviesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific movie by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the movie to retrieve' })
  @ApiResponse({ status: 200, description: 'Movie retrieved successfully', type: Movie })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: number) {
    return this.moviesService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific movie by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the movie to update' })
  @ApiBody({ description: 'Data to update the movie', type: UpdateMovieDto })
  @ApiResponse({ status: 200, description: 'Movie updated successfully', type: Movie })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can update movies' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(@Param('id') id: number, @Body() updateMovieDto: Partial<UpdateMovieDto>) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific movie by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the movie to delete' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can delete movies' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id') id: number) {
    return this.moviesService.remove(id);
  }
}
