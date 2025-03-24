import { Min } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  original_title: string

  @Column({ unique: true })
  poster_path: string;

  @Column()
  overview: string;

  @Column()
  original_language: string

  @Column({ type: 'date' })
  release_date: string

  @Column({ nullable: true })
  external_id: number
 
  @Column("int", { array: true })
  genre_ids?: number[];

  @Column({ default: 0 })
  @Min(0)
  vote_count: Number;

  @Column({ default: 0 })
  @Min(0)
  average_rating: Number;
}
