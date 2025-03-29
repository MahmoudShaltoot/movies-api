import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class UserDto {
  @ApiProperty({ description: 'Unique identifier of the user', example: 1 })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @Expose()
  full_name: string;

  @ApiProperty({ description: 'Username of the user', example: 'John' })
  @Expose()
  username: string;

  @ApiProperty({ description: 'Is admin user', example: false })
  @Expose()
  is_admin: string;

  @ApiProperty({ description: 'Date when the user was created', example: '2023-01-01T00:00:00Z' })
  @Expose()
  created_at: string;

  @ApiProperty({ description: 'Date when the user was last updated', example: '2023-01-02T00:00:00Z' })
  @Expose()
  updated_at: string;

  @Exclude()
  password: string
}
