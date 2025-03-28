import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateMoviesUsersRatingDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  movie_id: number;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;
}
