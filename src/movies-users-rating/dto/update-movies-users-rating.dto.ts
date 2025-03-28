import { PartialType } from '@nestjs/mapped-types';
import { CreateMoviesUsersRatingDto } from './create-movies-users-rating.dto';

export class UpdateMoviesUsersRatingDto extends PartialType(CreateMoviesUsersRatingDto) {}
