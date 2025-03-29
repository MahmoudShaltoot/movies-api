import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class WatchlistService {
  constructor(@InjectRepository(Watchlist)
  private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) { }

  async addToWatchlist(userId: number, movieId: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!user || !movie) {
      throw new NotFoundException('User or Movie not found');
    }
    delete user?.password;

    const existingWatchlist = await this.watchlistRepository.findOne({
      where: { user: { id: userId }, movie: { id: movieId } },
    });
    if (existingWatchlist) {
      throw new ConflictException('This movie is already in your watchlist');
    }

    const watchlistItem = this.watchlistRepository.create({ user, movie });
    return this.watchlistRepository.save(watchlistItem);
  }

  async findAll(userId: number, page: number, limit: number) {
    console.log(userId, page, limit);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['watchlists', 'watchlists.movie']
    });
    if (!user) {
      throw new NotFoundException('User or Movie not found');
    }

    return user.watchlists.map((watchlist) => watchlist.movie);
  }

  async remove(userId: number, movieId: number) {
    const watchlist = await this.watchlistRepository.findOneBy({ user: { id: userId }, movie: { id: movieId } });
    if (!watchlist) {
      throw new NotFoundException('Watchlist item not found');
    }

    return this.watchlistRepository.remove(watchlist);
  }
}
