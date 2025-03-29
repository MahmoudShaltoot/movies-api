import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AdminOrOwnerGuard } from '../guards/admin-or-owner.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of users' })
  @ApiQuery({ name: 'page', required: false, default: 0, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, default: 10, type: Number, description: 'Number of users per page' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  findAll(@Query('page') page: number = 0, @Query('limit') limit: number = 10,) {
    return this.UsersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.UsersService.findOne(+id);
  }

  @UseGuards(AdminOrOwnerGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user to update' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins or the user themselves can update' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: Partial<UpdateUserDto>) {
    return this.UsersService.update(+id, updateUserDto);
  }

  @UseGuards(AdminOrOwnerGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user to delete' })
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: UserDto })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins or the user themselves can delete' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.UsersService.remove(+id);
  }
}
