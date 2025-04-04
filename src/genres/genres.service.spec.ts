import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { createGenre } from './factory/genre.factory';
import { NotFoundException } from '@nestjs/common';

describe('GenresService', () => {
  let service: GenresService;
  let mockGenreRepository;

  beforeEach(async () => {
    mockGenreRepository = {
      create: jest.fn().mockImplementation((createGenreDto) => createGenre(createGenreDto)),
      save: jest.fn().mockImplementation((createGenreDto) => createGenre(createGenreDto)),
      find: jest.fn().mockResolvedValue([createGenre(), createGenre()]),
      findOneBy: jest.fn().mockResolvedValue(createGenre({ id: 1, name: 'Comedy' })),
      delete: jest.fn().mockImplementation((id) => ({ affected: 1 })),
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([createGenre(), createGenre()]),
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

  describe('findById', () => {
    it('should find a genres by id', async () => {
      const genre = await service.findById(1);
      expect(genre).toBeDefined()
      expect(genre.id).toBe(1)
    })

    it('should throw NotFoundException if genre is not found', async () => {
      jest.spyOn(mockGenreRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.findById(-1)).rejects.toThrow(NotFoundException);
    })
  })

  describe('findByNames', () => {
    it('should find genres by names', async () => {
      const genres = await service.findByNames(['Comedy', 'Drama']);
      expect(genres).toBeInstanceOf(Array);
    });
  });

  describe('deleteById', () => {
    it('should delete a genre by id', async () => {
      const response = await service.deleteById(1);
      expect(response).toBeDefined();
      expect(response.affected).toBe(1);
    });

    it('should throw NotFoundException if genre is not found', async () => {
      jest.spyOn(mockGenreRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.deleteById(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
