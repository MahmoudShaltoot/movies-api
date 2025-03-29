import { Controller, Get, Post, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Watchlist } from './entities/watchlist.entity';

@UseGuards(AuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) { }

  @Post('movies/:movieId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add specific movie to watchlist' })
  @ApiParam({ name: 'movieId', type: Number, description: 'ID of the movie to watchlist' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully', type: Watchlist })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 409, description: 'Conflict! This movie is already in your watchlist' })
  create(@Param('movieId') movieId: number, @Req() request) {
    return this.watchlistService.addToWatchlist(request.user.id, movieId);
  }

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve user watchlisted movies' })
  @ApiQuery({
    name: 'filters', required: false, description: 'Optional filters for watchlist movies',
    schema: {
      type: 'object',
      properties: {
        genre: { type: 'array', items: { type: 'string' }, example: ['Action', 'Drama'] },
        page: { type: 'integer', example: 1 },
        limit: { type: 'integer', example: 10 },
      },
    }
  })
  @ApiResponse({ status: 200, description: 'List of watchlisted movies retrieved successfully', type: [Watchlist] })
  findAll(@Query() filters: Record<string, any>, @Req() request) {
    return this.watchlistService.findAll(request.user.id, filters);
  }

  @Delete(':movieId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific movie from watchlist' })
  @ApiParam({ name: 'movieId', type: Number, description: 'ID of the movie to delete from watchlist' })
  @ApiResponse({ status: 200, description: 'Movie deleted from watchlist successfully' })
  @ApiResponse({ status: 404, description: 'Watchlist item not found' })
  remove(@Param('movieId') movieId: number, @Req() request) {
    return this.watchlistService.remove(request.user.id, movieId);
  }
}
