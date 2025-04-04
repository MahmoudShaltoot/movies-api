import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RaedisService', () => {
  let service: RedisService;
  const mockRedisClient = {
    hmset: jest.fn(),
    hgetall: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setHashKey', () => {
    it('should call Redis hmset with correct parameters', async () => {
      mockRedisClient.hmset.mockResolvedValue('OK');
      await service.setHashKey('key', {
        id: 1,
        title: 'Movie Title',
        poster_path: '/path/to/poster.jpg',
        original_title: 'Original Movie Title',
        original_language: 'en',
        genre_ids: [1, 2, 3],
      });

      expect(mockRedisClient.hmset).toHaveBeenCalledWith('key', {
        external_id: 1,
        title: 'Movie Title',
        poster_path: '/path/to/poster.jpg',
        original_title: 'Original Movie Title',
        original_language: 'en',
        genre_ids: JSON.stringify([1, 2, 3]),
      });
    });
  });

  describe('iskeyExist', () => {
    it('should call Redis exists with correct parameters', async () => {
      mockRedisClient.exists.mockResolvedValue(1);
      const result = await service.iskeyExist('key');
      expect(result).toBe(1);
      expect(mockRedisClient.exists).toHaveBeenCalledWith('key');
    });
  });
});
