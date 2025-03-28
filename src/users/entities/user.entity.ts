import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MoviesUsersRating } from "../../movies-users-rating/entities/movies-users-rating.entity";
import { Exclude } from "class-transformer";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column({unique: true})
    username: string;

    @Column()
    @Exclude()
    password?: string;

    @Column({default: false})
    is_admin: boolean

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => MoviesUsersRating, (rating) => rating.user)
    ratings: number[];
}
