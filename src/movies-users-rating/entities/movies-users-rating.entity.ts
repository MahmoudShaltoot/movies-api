import { User } from "../../users/entities/user.entity";
import { Movie } from "../../movies/entities/movie.entity";
import { IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MoviesUsersRating {
  @ApiProperty({ description: 'Unique identifier for the rating' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The user who gave the rating', type: () => User })
  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ApiProperty({ description: 'The movie being rated', type: () => Movie })
  @ManyToOne(() => Movie, (movie) => movie.ratings)
  @JoinColumn({ name: 'movie_id', referencedColumnName: 'id' })
  movie: Movie;

  @ApiProperty({ description: 'Rating value between 0 and 10', minimum: 0, maximum: 10 })
  @Column()
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ description: 'Timestamp when the rating was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Timestamp when the rating was last updated' })
  @UpdateDateColumn()
  updated_at: Date;
}
