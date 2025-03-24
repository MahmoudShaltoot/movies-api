import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString, isString } from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  original_title: string

  @IsNotEmpty()
  poster_path: string;

  @IsString()
  overview: string;

  @IsString()
  original_language: string

  @IsDateString()
  release_date

  @IsArray()
  @IsInt({each : true})
  @Type(() => Number)
  genre_ids: number[]

  @IsInt()
  external_id?: number;
}
