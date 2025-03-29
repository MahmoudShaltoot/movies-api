import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'Inception',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Original title of the movie',
    example: 'Inception',
  })
  @IsNotEmpty()
  original_title: string

  @ApiProperty({
    description: 'Path to the poster image of the movie',
    example: '/poster_path.jpg',
  })
  @IsNotEmpty()
  poster_path: string;

  @ApiProperty({
    description: 'Overview or description of the movie',
    example: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
  })
  @IsString()
  overview: string;

  @ApiProperty({
    description: 'Original language of the movie',
    example: 'en',
  })
  @IsString()
  original_language: string

  @ApiProperty({
    description: 'Release date of the movie in ISO 8601 format',
    example: '2010-07-16',
  })
  @IsDateString()
  release_date: string

  @ApiProperty({
    description: 'Array of genre IDs associated with the movie, must be external genre_id',
    example: [28, 12, 878],
  })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  genre_ids: number[]
}
