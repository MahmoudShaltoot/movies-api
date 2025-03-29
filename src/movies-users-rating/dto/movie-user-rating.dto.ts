import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

export class MovieUserRatingDto {
  @ApiProperty({
    description: 'Rating value for the movie (between 0 and 10)',
    example: 8,
    minimum: 0,
    maximum: 10,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;
}