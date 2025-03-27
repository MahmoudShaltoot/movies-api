import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

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
    const isValid: boolean = bcrypt.compareSync(password, user.password);
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