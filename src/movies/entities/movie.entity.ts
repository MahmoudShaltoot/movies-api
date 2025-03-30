import { Max, Min } from "class-validator";
import { MoviesUsersRating } from "../../movies-users-rating/entities/movies-users-rating.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Watchlist } from "../../watchlist/entities/watchlist.entity";
@Entity('movies')
export class Movie {
  @ApiProperty({
    description: 'Unique identifier of the movie',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Title of the movie',
    example: 'Inception',
  })
  @Column({ unique: true })
  title: string;

  @ApiProperty({
    description: 'Original title of the movie',
    example: 'Inception',
  })
  @Column({ unique: true })
  original_title: string

  @ApiProperty({
    description: 'Path to the poster image of the movie',
    example: '/poster_path.jpg',
  })
  @Column({ nullable: true })
  poster_path: string;

  @ApiProperty({
    description: 'Overview or description of the movie',
    example: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
  })
  @Column()
  overview: string;

  @ApiProperty({
    description: 'Original language of the movie',
    example: 'en',
  })
  @Column()
  original_language: string

  @ApiProperty({
    description: 'Release date of the movie in ISO 8601 format',
    example: '2010-07-16',
  })
  @Column({ type: 'date' })
  release_date: string

  @ApiProperty({
    description: 'External ID of the movie (optional)',
    example: 12345,
    required: false,
  })
  @Column({ nullable: true })
  external_id: number
 

  @ApiProperty({
    description: 'Array of genre IDs associated with the movie',
    example: [28, 12, 878],
    required: false,
  })
  @Column("int", { array: true })
  genre_ids?: number[];

  @ApiProperty({
    description: 'Number of votes the movie has received',
    example: 100,
    minimum: 0,
    default: 0,
  })
  @Column({ default: 0 })
  @Min(0)
  vote_count: number;

  @ApiProperty({
    description: 'Average rating of the movie (between 0 and 10)',
    example: 8.5,
    minimum: 0,
    maximum: 10,
    default: 0,
  })
  @Column({ type: 'float' , default: 0 })
  @Min(0)
  @Max(10)
  average_rating: number;

  @ApiProperty({
    description: 'List of user ratings for the movie',
    type: () => [MoviesUsersRating],
  })
  @OneToMany(() => MoviesUsersRating, (rating) => rating.movie)
  ratings: MoviesUsersRating[];

  @ApiProperty({
    description: 'List of watchlist movies',
    type: () => [Watchlist],
  })
  @OneToMany(() => Watchlist, (watchlist) => watchlist.movie)
  watchlists: Watchlist[];
}
