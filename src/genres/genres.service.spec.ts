import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { createGenre } from './factory/genre.factory';

describe('GenresService', () => {
  let service: GenresService;
  let mockGenreRepository;

  beforeEach(async () => {
    mockGenreRepository = {
      create: jest.fn().mockImplementation((createGenreDto) => createGenre(createGenreDto)),
      save: jest.fn().mockImplementation((createGenreDto) => createGenre(createGenreDto)),
      find: jest.fn().mockResolvedValue([createGenre(), createGenre()]),
      findOneByOrFail: jest.fn().mockResolvedValue(createGenre({ id: 1, name: 'Comedy' })),
      findOneBy: jest.fn().mockResolvedValue(createGenre({ id: 1, name: 'Comedy' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGenre', () => {
    it('should create a genres', async () => {
      const genre = await service.createGenre({ name: 'Action', external_id: 10 });
      expect(mockGenreRepository.create).toHaveBeenCalled();
      expect(mockGenreRepository.save).toHaveBeenCalled();
      expect(genre).toBeDefined()
      expect(genre.name).toBe('Action')
    })
  })

  describe('findAll', () => {
    it('should return a list of genres', async () => {
      const genres = await service.findAll();
      expect(mockGenreRepository.find).toHaveBeenCalled();
      expect(genres).toHaveLength(2);
    })
  })

  describe('find', () => {
    it('should find a genres by id', async () => {
      const genre = await service.findById(1);
      expect(genre).toBeDefined()
      expect(genre.id).toBe(1)
    })
  })
});
