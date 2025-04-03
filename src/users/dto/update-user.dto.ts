import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  full_name?: string;

  @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiProperty({ description: 'Password of the user', example: 'P@ssw0rd' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password?: string
}
