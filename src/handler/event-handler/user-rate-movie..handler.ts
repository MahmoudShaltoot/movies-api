import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MoviesService } from "src/movies/movies.service";

@Injectable()
export class UserRateMovieEventHandler {
	constructor(private readonly moviesService: MoviesService) {}

	@OnEvent('USER_RATE_MOVIE')
	async handleUserRateMovieEvent(movie_id: number, newRating: number) {
        this.moviesService.updateMovieRating(movie_id, newRating)
    }
}