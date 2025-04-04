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
import { createWatchlist } from './factory/watchlist.factory';

describe('WatchlistController', () => {
  let controller: WatchlistController;
  let watchlistService: WatchlistService;
  let mockWatchlistRepository;
  let mockUserRepository;
  let mockMovieRepository;
  let mockGenreRepository;
  let mockWatchlistService;

  mockWatchlistService = {
    addToWatchlist: jest.fn().mockResolvedValue(createWatchlist()),
    findAll: jest.fn().mockResolvedValue([createWatchlist(), createWatchlist()]),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [GenresService, JwtService,
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
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
    watchlistService = module.get<WatchlistService>(WatchlistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call WatchlistService.addToWatchlist when adding a movie to the watchlist', async () => {
    const req = { user: { id: 1 } };
    const movieId = 10;
    const result = await controller.create(movieId, req);
    expect(watchlistService.addToWatchlist).toHaveBeenCalledWith(req.user.id, movieId);
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('movie');
  });

  it('should call WatchlistService.findAll when retrieving the watchlist', async () => {
    const req = { user: { id: 1 } };
    const filters = {page: '1', limit: '10'}
    const result = await controller.findAll(filters, req);
    expect(watchlistService.findAll).toHaveBeenCalledWith(req.user.id, filters);
    expect(result).toHaveLength(2);
  });

  it('should call WatchlistService.remove when removing a movie from the watchlist', async () => {
    const req = { user: { id: 1 } };
    const movieId = 10;
    const result = await controller.remove(movieId, req);
    expect(watchlistService.remove).toHaveBeenCalledWith(req.user.id, movieId);
    expect(result).toHaveProperty('affected');
    expect(result).toEqual({ affected: 1 });
  });
});
