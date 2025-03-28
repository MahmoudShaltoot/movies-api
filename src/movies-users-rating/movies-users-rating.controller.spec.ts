import { Test, TestingModule } from '@nestjs/testing';
import { MoviesUsersRatingController } from './movies-users-rating.controller';
import { MoviesUsersRatingService } from './movies-users-rating.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesUsersRating } from './entities/movies-users-rating.entity';
import { MoviesService } from '../movies/movies.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { JwtService } from '@nestjs/jwt';

describe('MoviesUsersRatingController', () => {
  let controller: MoviesUsersRatingController;
  let mockUsersRatingRepository;
  let mockUsersRepository;
  let mockMoviesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesUsersRatingController],
      providers: [MoviesUsersRatingService, UsersService, MoviesService, JwtService,
        {
          provide: getRepositoryToken(MoviesUsersRating),
          useValue: mockUsersRatingRepository
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMoviesRepository
        },
        {
          provide: EventEmitter2,
          useValue: { emitAsync: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<MoviesUsersRatingController>(MoviesUsersRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
