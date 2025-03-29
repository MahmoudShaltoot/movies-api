import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Watchlist } from './entities/watchlist.entity';
import { JwtService } from '@nestjs/jwt';
import { GenresService } from 'src/genres/genres.service';
import { Genre } from 'src/genres/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist, Genre, Movie, User])],
  controllers: [WatchlistController],
  providers: [WatchlistService,GenresService, JwtService],
})
export class WatchlistModule {}
