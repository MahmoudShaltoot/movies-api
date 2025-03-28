import { Test, TestingModule } from '@nestjs/testing';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';

describe('MoviesUsersRatingService', () => {
  let service: MoviesUsersRatingService;
  let mockUsersRatingRepository;
  let mockUsersRepository;
  let mockMoviesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesUsersRatingService, MoviesService, UsersService,
        {
          provide: getRepositoryToken(MoviesUsersRating),
          useValue: mockUsersRatingRepository,
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
