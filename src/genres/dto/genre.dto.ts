
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  external_id: number;
}