import { Test, TestingModule } from '@nestjs/testing';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';
import { Genre } from '../genres/entities/genre.entity';
import { GenresService } from '../genres/genres.service';

describe('MoviesUsersRatingService', () => {
  let service: MoviesUsersRatingService;
  let mockUsersRatingRepository;
  let mockUsersRepository;
  let mockMoviesRepository;
  let mockGenresRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesUsersRatingService, MoviesService, UsersService, GenresService,
        {
          provide: getRepositoryToken(MoviesUsersRating),
          useValue: mockUsersRatingRepository,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenresRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockMoviesRepository,
        },
        {
          provide: EventEmitter2,
          useValue: { emitAsync: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MoviesUsersRatingService>(MoviesUsersRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
