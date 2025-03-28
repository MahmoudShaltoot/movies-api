
import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MoviesService } from '../movies.service';
import { TmdbMovie } from '../../tmdb/interface/tmdb.interface';

@Controller()
export class MovieConsumer {
  constructor(private readonly moviesService: MoviesService) { }

  @EventPattern('new-movie')
  async getHello(@Payload() data: TmdbMovie, @Ctx() context: RmqContext): Promise<any> {
    await this.moviesService.saveMovieMessage(data);
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }
}
