import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { createMovie } from './factory/movie.factory';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { JwtService } from '@nestjs/jwt';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';

describe('MoviesController', () => {
  let controller: MoviesController;
  let mockMovieRepository;
  let mockGenreRepository;

  mockMovieRepository = {
    create: jest.fn().mockImplementation((createMovieDto) => createMovie(createMovieDto)),
    save: jest.fn().mockImplementation((createMovieDto) => createMovie(createMovieDto)),
    find: jest.fn().mockResolvedValue([createMovie(), createMovie()]),
    findOne: jest.fn().mockResolvedValue(createMovie()),
    findOneBy: jest.fn().mockResolvedValue(createMovie()),
    update: jest.fn().mockResolvedValue({ "affected": 1 }),
    delete: jest.fn().mockResolvedValue({ "affected": 1 })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService, JwtService, GenresService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository
        }
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
