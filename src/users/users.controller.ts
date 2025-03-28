import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AdminOrOwnerGuard } from '../guards/admin-or-owner.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) { }

  @Get()
  findAll(@Query('page') page: number = 0, @Query('limit') limit: number = 10,) {
    return this.UsersService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UsersService.findOne(+id);
  }

  @UseGuards(AdminOrOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.UsersService.update(+id, updateUserDto);
  }

  @UseGuards(AdminOrOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.UsersService.remove(+id);
  }
}
