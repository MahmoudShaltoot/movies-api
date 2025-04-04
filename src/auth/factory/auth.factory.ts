import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "../../users/entities/user.entity";
import * as bcrypt from 'bcryptjs';


export const createUser = (overrides?: Partial<User>): CreateUserDto & User => {
  if (overrides?.password) {
    overrides.password = bcrypt.hashSync(overrides.password, 10);
  }

  return {
    id: Math.floor(Math.random() * 1000),
    username: 'test',
    full_name: 'test user',
    password: bcrypt.hashSync('P@ssw0rd', 10),  
    created_at: new Date(),
    updated_at: new Date(),
    is_admin: false,
    ratings: [],
    watchlists: [],
    ...overrides, // Overriding default properties
  };
};
