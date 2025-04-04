import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { createMovie } from './factory/movie.factory';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../genres/entities/genre.entity';
import { TmdbMovie } from 'src/tmdb/interface/tmdb.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let genreService: GenresService;

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
      manager: {
        connection: {
          createQueryRunner: jest.fn(),
        }
      },
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
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    genreService = module.get<GenresService>(GenresService);
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

  describe('saveMovieMessage', () => {
    it('should save movie message', async () => {
      const movie: Partial<TmdbMovie> = {
        id: 1,
        title: 'Movie Title',
      };
      mockMovieRepository.findOne.mockResolvedValueOnce(null);

      await service.saveMovieMessage(movie as TmdbMovie);

      expect(mockMovieRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockMovieRepository.create).toHaveBeenCalledTimes(1);
      expect(mockMovieRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw conflict error if movie found', async () => {
      const movie: Partial<TmdbMovie> = {
        id: 1,
        title: 'Existing movie',
      };

      try {
        await service.saveMovieMessage(movie as TmdbMovie);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  })

  describe('findAll', () => {
    it('should return a list of movies based on filters', async () => {
      const filters = {
        title: 'Action',
        genre: '["Action", "Drama"]',
        release_date: '2021-01-01',
        sortBy: 'average_rating',
        sortOrder: 'asc',
        page: '1',
        limit: '10',
      };

      const mockGenres = [1, 2];

      jest.spyOn(genreService, 'findByNames').mockResolvedValue(mockGenres);

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]),
      };

      mockMovieRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(filters);

      expect(mockMovieRepository.createQueryBuilder).toHaveBeenCalledWith('movie');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('movie.title LIKE :title', { title: '%Action%' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('movie.genre_ids && ARRAY[:...genres]::int[]', { genres: [1, 2] });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('movie.release_date = :release_date', { release_date: '2021-01-01' });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('movie.average_rating', 'ASC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      expect(result).toEqual([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]);
    });
  });

  describe('updateMovieRating', () => {
    it('should update movie rating successfully', async () => {
      const movie_id = 1;
      const newRating = 4.5;

      const movie = {
        id: movie_id,
        vote_count: 10,
        average_rating: 4.2,
      };

      const queryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn().mockResolvedValue(movie),
          update: jest.fn().mockResolvedValue({ affected: 1 }),
        },
      };

      mockMovieRepository.manager.connection.createQueryRunner.mockReturnValue(queryRunner);

      await service.updateMovieRating(movie_id, newRating);

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();

      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Movie, {
        where: { id: movie_id },
        lock: { mode: 'pessimistic_write' },
      });

      const expectedAvgRating = (movie.average_rating * movie.vote_count + newRating) / (movie.vote_count + 1);
      const roundedAvgRating = parseFloat(expectedAvgRating.toFixed(2));
      expect(queryRunner.manager.update).toHaveBeenCalledWith(Movie, movie_id, {
        vote_count: movie.vote_count + 1,
        average_rating: roundedAvgRating,
      });
    });

    it('should throw an error if movie is not found', async () => {
      const movie_id = 1;
      const newRating = 4.5;

      const queryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn().mockResolvedValue(null),
        },
      };

      mockMovieRepository.manager.connection.createQueryRunner.mockReturnValue(queryRunner);

      try {
        await service.updateMovieRating(movie_id, newRating);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    })
  })
});
