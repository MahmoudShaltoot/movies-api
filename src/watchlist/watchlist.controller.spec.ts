import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';
import { JwtService } from '@nestjs/jwt';

describe('WatchlistController', () => {
  let controller: WatchlistController;
  let mockWatchlistRepository;
  let mockUserRepository;
  let mockMovieRepository;
  let mockGenreRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [WatchlistService, GenresService, JwtService,
        {
          provide: getRepositoryToken(Watchlist),
          useValue: mockWatchlistRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
