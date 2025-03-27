import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}
