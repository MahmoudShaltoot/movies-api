import { Test, TestingModule } from '@nestjs/testing';
import { TmdbService } from './tmdb.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { TmdbResponse } from './interface/tmdb.interface';
import { AxiosResponse } from 'axios';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpService: HttpService;
  let redisService: RedisService;
  let clientProxy: ClientProxy;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockRedisService = {
    getHashKey: jest.fn(),
    setHashKey: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        TmdbService,
        ConfigService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<TmdbService>(TmdbService);
    httpService = module.get<HttpService>(HttpService);
    redisService = module.get<RedisService>(RedisService);
    clientProxy = module.get<ClientProxy>('RABBITMQ_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPopularMovies', () => {
    it('should get popular movies', async () => {
      const mockResponse: AxiosResponse<TmdbResponse> = {
        data: {
          results: [],
          page: 1,
          total_results: 0,
          total_pages: 0,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockHttpService.get.mockReturnValue(of(mockResponse));
      mockRedisService.getHashKey.mockReturnValue(of({}));

      const result = await service.getPopularMovies();
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getGenres', () => {
    it('should get genres', async () => {
      const mockResponse: AxiosResponse<any> = {
        data: {
          genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Drama' }],
          page: 1,
          total_results: 0,
          total_pages: 0,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockHttpService.get.mockReturnValue(of(mockResponse));
      mockRedisService.getHashKey.mockReturnValue(of(mockResponse));
      const result = await service.getGenres();
      expect(result).toEqual(mockResponse.data.genres);
    });
  });
});
