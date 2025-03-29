import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MoviesUsersRating } from '../../movies-users-rating/entities/movies-users-rating.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Full name of the user' })
  @Column()
  full_name: string;

  @ApiProperty({ description: 'Unique username for the user' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Password of the user', writeOnly: true })
  @Column()
  @Exclude()
  password?: string;

  @ApiProperty({ description: 'Indicates if the user is an admin', default: false })
  @Column({ default: false })
  is_admin: boolean;

  @ApiProperty({ description: 'Date when the user was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'List of ratings associated with the user', type: [Number] })
  @OneToMany(() => MoviesUsersRating, (rating) => rating.user)
  ratings: number[];
}
