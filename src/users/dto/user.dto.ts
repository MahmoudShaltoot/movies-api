import { Exclude, Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: string;
    
    @Expose()
    full_name: string;

    @Expose()
    username: string;

    @Expose()
    is_admin: string;
    
    @Expose()
    created_at: string;
    
    @Expose()
    updated_at: string;

    @Exclude()
    password: string
}