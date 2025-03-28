import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MoviesService } from "../../movies/movies.service";

@Injectable()
export class UserRateMovieEventHandler {
  constructor(private readonly moviesService: MoviesService) { }

  @OnEvent('USER_RATE_MOVIE')
  async handleUserRateMovieEvent(userRating: { movie_id: number, newRating: number }) {
    this.moviesService.updateMovieRating(userRating.movie_id, userRating.newRating)
  }
}
