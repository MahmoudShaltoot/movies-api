import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post('movies/:movieId')
  create(@Param('movieId') movieId: number, @Req() request) {
    return this.watchlistService.addToWatchlist(request.user.id, movieId);
  }

  @Get('')
  findAll(@Query() filters: Record<string, any>, @Req() request) {
    return this.watchlistService.findAll(request.user.id, filters);
  }

  @Delete(':movieId')
  remove(@Param('movieId') movieId: number, @Req() request) {
    return this.watchlistService.remove(request.user.id, movieId);
  }
}
