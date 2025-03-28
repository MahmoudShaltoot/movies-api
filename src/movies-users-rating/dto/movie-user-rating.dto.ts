import { IsInt, Max, Min } from "class-validator";

export class MovieUserRatingDto {
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;
}