import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let mockWatchlistRepository;
  let mockUserRepository;
  let mockMovieRepository;
  let mockGenreRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchlistService, GenresService,
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

    service = module.get<WatchlistService>(WatchlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
