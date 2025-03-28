import { Test, TestingModule } from '@nestjs/testing';
import { MoviesUsersRatingController } from './movies-users-rating.controller';
import { MoviesUsersRatingService } from './movies-users-rating.service';

describe('MoviesUsersRatingController', () => {
  let controller: MoviesUsersRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesUsersRatingController],
      providers: [MoviesUsersRatingService],
    }).compile();

    controller = module.get<MoviesUsersRatingController>(MoviesUsersRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
