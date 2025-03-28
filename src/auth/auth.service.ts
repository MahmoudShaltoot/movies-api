import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneby({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValid: boolean = bcrypt.compareSync(password, user.password as string);
    if (!isValid) {
      throw new BadRequestException('Incorrect password');
    }
    return user;
  }

  async login(user: User) {
    const payload = { id: user.id, username: user.username, isAdmin: user.is_admin };
    return { access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }) };
  }

  async register(user: CreateUserDto) {
    const existingUser = await this.usersService.findOneby({username: user.username});
    if (existingUser) {
      throw new BadRequestException('username already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.usersService.create({...user, password: hashedPassword});
    return this.login(createdUser);
  }
}