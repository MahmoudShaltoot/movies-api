
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Name of the genre',
    example: 'Action',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'External ID of the genre (optional)',
    example: 123,
    required: false,
  })
  @IsInt()
  external_id: number;
}
