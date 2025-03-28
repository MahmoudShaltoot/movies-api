import { Test, TestingModule } from '@nestjs/testing';
import { TmdbService } from './tmdb.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

describe('TmdbService', () => {
  let service: TmdbService;
  let mockRabbitMQ = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [TmdbService, RedisService, ConfigService,
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: mockRabbitMQ,
        }
      ],
    }).compile();

    service = module.get<TmdbService>(TmdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
