import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { RedisService } from '../redis/redis.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [(process.env.RABBITMQ_URL || 'amqp://localhost:5672')],
          queue: 'movies_queue',
        },
      },
    ]),
  ],
  providers: [TmdbService, RedisService],
  exports: [TmdbService, ClientsModule],
})
export class TmdbModule {}
