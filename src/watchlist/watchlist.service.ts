import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { GenresService } from 'src/genres/genres.service';

@Injectable()
export class WatchlistService {
  constructor(@InjectRepository(Watchlist)
  private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private readonly genresService: GenresService
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

  async findAll(userId: number, filters: Record<string, any>) {
    const queryBuilder = this.watchlistRepository.createQueryBuilder('watchlist')
      .leftJoinAndSelect('watchlist.movie', 'movie')
      .where('watchlist.user_id = :userId', { userId })

    if (filters.genre?.length > 0) {
      const genresArray = JSON.parse(filters.genre);
      const genres = await this.genresService.findByNames(genresArray);      
      queryBuilder.andWhere('movie.genre_ids && ARRAY[:...genres]::int[]', { genres });
    }

    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
    return queryBuilder.getMany();
  }

  async remove(userId: number, movieId: number) {
    const watchlist = await this.watchlistRepository.findOneBy({ user: { id: userId }, movie: { id: movieId } });
    if (!watchlist) {
      throw new NotFoundException('Watchlist item not found');
    }

    return this.watchlistRepository.remove(watchlist);
  }
}
