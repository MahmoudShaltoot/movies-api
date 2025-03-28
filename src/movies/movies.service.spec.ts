import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { createMovie } from './factory/movie.factory';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockMovieRepository;
  let mockGenreRepository;
  let repository;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockImplementation((createMovieDto) => createMovie(createMovieDto)),
    getMany: jest.fn().mockResolvedValue([createMovie(), createMovie()]),
  };

  beforeEach(async () => {
    mockMovieRepository = {
      create: jest.fn().mockImplementation((createMovieDto) => createMovie(createMovieDto)),
      save: jest.fn().mockImplementation((createMovieDto) => createMovie(createMovieDto)),
      find: jest.fn().mockResolvedValue([createMovie(), createMovie()]),
      findOne: jest.fn().mockResolvedValue(createMovie()),
      findOneBy: jest.fn().mockResolvedValue(createMovie()),
      update: jest.fn().mockResolvedValue({ "affected": 1 }),
      delete: jest.fn().mockResolvedValue({ "affected": 1 }),
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        GenresService,
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

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto = {
        title: 'the martian',
        original_title: 'the martian',
        poster_path: '/poster.jpg',
        overview: 'A movie about survival on Mars.',
        original_language: 'en',
        release_date: '2030-10-02',
        genre_ids: [1, 2],
        external_id: 10,
        vote_count: 0,
        average_rating: 0
      }

      const savedMovie = {
        id: 1,
        ...createMovieDto
      }

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const result = await service.create(savedMovie);

      expect(mockMovieRepository.save).toHaveBeenCalled();
      expect(result).toEqual(savedMovie)
    })

    it('should throw an error if movie exist', async () => {
      const createMovieDto = {
        title: 'the martian',
        original_title: 'the martian',
        poster_path: '/poster.jpg',
        overview: 'A movie about survival on Mars.',
        original_language: 'en',
        release_date: '2030-10-02',
        genre_ids: [1, 2],
        external_id: 10,
        vote_count: 0,
        average_rating: 0
      }

      await expect(service.create(createMovieDto)).rejects.toThrow();
    })
  })

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const filters = { page: '1', limit: '10' };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a movie if it exists', async () => {
      const movieId = 1;
      const mockMovie = createMovie({ id: movieId });

      jest.spyOn(mockMovieRepository, 'findOneBy').mockResolvedValue(mockMovie);

      const result = await service.findOne(movieId);

      expect(mockMovieRepository.findOneBy).toHaveBeenCalledWith({ id: movieId });
      expect(result).toEqual(mockMovie);
    });

    it('should throw an error if the movie does not exist', async () => {
      const movieId = -1;

      jest.spyOn(mockMovieRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(service.findOne(movieId)).rejects.toThrow(`Movie with ID ${movieId} not found`);
      expect(mockMovieRepository.findOneBy).toHaveBeenCalledWith({ id: movieId });
    });
  });

  describe('update', () => {
    it('should update a movie if it exists', async () => {
      const movieId = 1;
      const updateMovieDto = {
        title: 'Updated Title',
        overview: 'Updated Overview',
      };

      const result = await service.update(movieId, updateMovieDto);

      expect(mockMovieRepository.findOneBy).toHaveBeenCalledWith({ id: movieId });
      expect(mockMovieRepository.update).toHaveBeenCalledWith({ id: movieId }, updateMovieDto);
      expect(result.affected).toEqual(1);
    });

    it('should throw an error if the movie does not exist', async () => {
      const movieId = -1;
      const updateMovieDto = {
        title: 'Updated Title',
        overview: 'Updated Overview',
      };

      jest.spyOn(mockMovieRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(service.update(movieId, updateMovieDto)).rejects.toThrow(`Movie with ID ${movieId} not found`);
      expect(mockMovieRepository.findOneBy).toHaveBeenCalledWith({ id: movieId });
      expect(mockMovieRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a movie if it exists', async () => {
      const movieId = 1;

      const result = await service.remove(movieId);
      expect(mockMovieRepository.delete).toHaveBeenCalledWith({ id: movieId });
      expect(result.affected).toEqual(1);
    });

    it('should throw an error if the movie does not exist', async () => {
      const movieId = -1;

      jest.spyOn(mockMovieRepository, 'delete').mockResolvedValue({ affected: 0 });

      const result = await service.remove(movieId);
      expect(mockMovieRepository.delete).toHaveBeenCalledWith({ id: movieId });
      expect(result.affected).toEqual(0);
    });
  });
});
