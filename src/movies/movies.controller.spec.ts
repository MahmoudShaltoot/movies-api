import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { createMovie } from './factory/movie.factory';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GenresService } from '../genres/genres.service';
import { JwtService } from '@nestjs/jwt';
import { Genre } from '../genres/entities/genre.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;
  let mockGenreRepository;

  const mockMoviesService = {
    create: jest.fn().mockImplementation((createMovieDto) => createMovie(createMovieDto)),
    findAll: jest.fn().mockResolvedValue([createMovie(), createMovie()]),
    findOne: jest.fn().mockResolvedValue(createMovie()),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService, GenresService, JwtService,
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository
        }
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call MoviesService.create when creating a movie', async () => {
    const createMovieDto = { title: 'Inception', original_language: 'en' } as CreateMovieDto;
    await controller.create(createMovieDto);
    expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
  });

  it('should call MoviesService.findAll when retrieving all movies', async () => {
    await controller.findAll({});
    expect(moviesService.findAll).toHaveBeenCalled();
  });

  it('should call MoviesService.findOne when retrieving movie by id', async () => {
    await controller.findOne(1);
    expect(moviesService.findOne).toHaveBeenCalled();
  });

  it('should call MoviesService.update when updating movie by id', async () => {
    await controller.update(1, { title: 'Updated Title' });
    expect(moviesService.update).toHaveBeenCalled();
  });

  it('should call MoviesService.remove when removing movie by id', async () => {
    await controller.remove(1);
    expect(moviesService.remove).toHaveBeenCalled();
  });
});
