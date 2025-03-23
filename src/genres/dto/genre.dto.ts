
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  external_id?: number;
}
