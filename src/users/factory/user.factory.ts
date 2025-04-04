import { User } from "../entities/user.entity";

export function createUser(overrides?: Partial<User>): User {
  return {
    id: Math.floor(Math.random() * 1000),
    username: 'test',
    full_name: 'test user',
    password: 'P@ssw0rd',
    created_at: new Date("01-01-2025"),
    updated_at: new Date("01-01-2025"),
    is_admin: false,
    ratings: [],
    watchlists: [],
    ...overrides, // Overriding default properties
  };
} 