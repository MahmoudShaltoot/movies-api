import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { createGenre } from './factory/genre.factory';
import { JwtService } from '@nestjs/jwt';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  beforeEach(async () => {
    const mockGenresService = {
      findAll: jest.fn().mockResolvedValue([createGenre(), createGenre()]),
      find: jest.fn().mockResolvedValue(createGenre({ id: 1, name: 'Comedy' })),
      createGenre: jest.fn().mockResolvedValue(createGenre({ id: 1, name: 'Horror' })),
      findById: jest.fn().mockResolvedValue(createGenre({ id: 1, name: 'Comedy' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        JwtService,
        {
          provide: GenresService,
          useValue: mockGenresService,
        }],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all genres', async () => {
    const genres = await controller.findAll();
    expect(genres).toHaveLength(2);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a genre by ID', async () => {
    const genre = await controller.findById(1);
    expect(genre).toBeDefined();
    expect(genre.id).toBe(1);
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('should create a new genre', async () => {
    const createGenreDto = { name: 'Horror', external_id: 10 };
    const genre = await controller.create(createGenreDto);
    expect(genre).toBeDefined();
    expect(genre.name).toBe('Horror');
    expect(service.createGenre).toHaveBeenCalledWith(createGenreDto);
  });
});
