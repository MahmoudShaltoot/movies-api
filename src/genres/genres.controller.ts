import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/genre.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin.guard';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @UseGuards(AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiBody({ description: 'Data to create a new genre', type: CreateGenreDto })
  @ApiResponse({ status: 201, description: 'Genre created successfully', type: Genre })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can delete genres' }) // Add a 403 response for unauthorized access
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genresService.createGenre(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all genres' })
  @ApiResponse({ status: 200, description: 'List of genres retrieved successfully', type: [Genre] })
  async findAll(): Promise<Genre[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a genre by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the genre to retrieve' })
  @ApiResponse({ status: 200, description: 'Genre retrieved successfully', type: Genre })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  async findById(@Param('id') id: number): Promise<Genre> {
    return this.genresService.findById(id);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a genre by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the genre to delete' })
  @ApiResponse({ status: 200, description: 'Genre deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can delete genres' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  async deleteById(@Param('id') id: number) {
    return this.genresService.deleteById(id);
  }
}
