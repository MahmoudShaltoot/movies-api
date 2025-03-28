import { Test, TestingModule } from '@nestjs/testing';
import { MoviesUsersRatingService } from './movies-users-rating.service';

describe('MoviesUsersRatingService', () => {
  let service: MoviesUsersRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesUsersRatingService],
    }).compile();

    service = module.get<MoviesUsersRatingService>(MoviesUsersRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
