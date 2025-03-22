import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  external_id: number;

  @Column()
  name: string;
}