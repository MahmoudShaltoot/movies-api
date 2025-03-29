import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "../../movies/entities/movie.entity";
import { User } from "../../users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('watchlists')
@Unique(['user', 'movie'])
export class Watchlist {
  @ApiProperty({ description: 'Unique identifier for the watchlist' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User associated with the watchlist', type: () => [User] })
  @ManyToOne(() => User, (user) => user.watchlists)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Movie associated with the watchlist', type: () => [Movie] })
  @ManyToOne(() => Movie, (movie) => movie.watchlists)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}
