import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';
import { createUser } from '../auth/factory/auth.factory';
import { createMovie, createWatchlist } from './factory/watchlist.factory';
import { create, find } from 'lodash';
import { skip } from 'node:test';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let mockWatchlistRepository;
  let mockUserRepository;
  let mockMovieRepository;
  let mockGenreRepository;
  let mockQueryBuilder;
  let genreService: GenresService;

  mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(createUser()),
  }

  mockMovieRepository = {
    findOne: jest.fn().mockResolvedValue(createMovie()),
  }

  beforeEach(async () => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([createWatchlist(), createWatchlist()]),
      getOne: jest.fn().mockResolvedValue(createWatchlist()),
    };

    mockWatchlistRepository = {
      create: jest.fn().mockResolvedValue(createWatchlist()),
      save: jest.fn().mockResolvedValue(createWatchlist()),
      find: jest.fn().mockResolvedValue([createWatchlist(), createWatchlist()]),
      remove: jest.fn().mockResolvedValue({ affected: 1 }),
      findOne: jest.fn().mockResolvedValue(null),
      findOneBy: jest.fn().mockResolvedValue(createWatchlist()),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };


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
    genreService = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToWatchlist', () => {
    it('should add a movie to the watchlist', async () => {
      const user = createUser();
      const movie = createMovie();
      const watchlist = createWatchlist({ user, movie });

      const result = await service.addToWatchlist(watchlist.user.id, watchlist.movie.id);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
    });
  });

  describe('findAll', () => {
    it('should retrieve all watchlist items for a user', async () => {
      const filters = {
        genre: '["Action", "Drama"]',
        page: 1,
        limit: 10,
      };
      const mockGenres = [1, 2];
      jest.spyOn(genreService, 'findByNames').mockResolvedValue(mockGenres);

      const userId = 1;
      const result = await service.findAll(userId, filters);

      expect(mockWatchlistRepository.createQueryBuilder).toHaveBeenCalledWith('watchlist');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('watchlist.user_id = :userId', { userId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('movie.genre_ids && ARRAY[:...genres]::int[]', { genres: [1, 2] });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(filters.limit);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('remove', () => {
    it('should remove a movie from the watchlist', async () => {
      const user = createUser();
      const movieId = 10;

      const result = await service.remove(user.id, movieId);
      expect(mockWatchlistRepository.remove).toHaveBeenCalled();
      expect(result).toEqual({ affected: 1 });
    });
  });
});
