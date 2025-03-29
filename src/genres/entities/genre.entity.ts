import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genres')
export class Genre {
  @ApiProperty({
    description: 'External ID of the genre (optional)',
    example: 123,
    required: false,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the genre',
    example: 'Action',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'External ID of the genre (optional)',
    example: 123,
    required: false,
  })
  @Column({ nullable: true })
  external_id: number;
}