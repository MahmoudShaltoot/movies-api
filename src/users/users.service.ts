import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  async findAll(page, page_size) {
    const users = await this.usersRepository.find({ skip: page * page_size, take: page_size });
    return users.map(user => plainToClass(UserDto, user, { excludeExtraneousValues: true }))
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  async findOneby(option: FindOptionsWhere<User>) {
    return this.usersRepository.findOneBy(option);
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await  this.usersRepository.save({ ...user, ...updateUserDto });
    return plainToClass(UserDto, updatedUser, { excludeExtraneousValues: true });
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(user);
  }
}
