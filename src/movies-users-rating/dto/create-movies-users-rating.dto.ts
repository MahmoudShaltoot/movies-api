import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateMoviesUsersRatingDto {
  @ApiProperty({
    description: 'ID of the user creating the rating',
    example: 1,
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: 'ID of the movie being rated',
    example: 101,
  })
  @IsNotEmpty()
  movie_id: number;

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
