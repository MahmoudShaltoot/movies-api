import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let mockUserRepository = {};

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [JwtService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: 1, username: 'john', full_name: 'John Doe' }, { id: 2, username: 'jane', full_name: 'Jane Doe' }];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const mockUser = { id: userId, username: 'john', full_name: 'John Doe' };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      mockUsersService.findOne.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto = { full_name: 'John Updated' };
      const mockUser = { id: userId, ...updateUserDto };

      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update(userId, updateUserDto);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const userId = 1;

      mockUsersService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(userId);
      expect(service.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if user is not found during removal', async () => {
      const userId = 1;

      mockUsersService.remove.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.remove(userId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(userId);
    });
  });
});
