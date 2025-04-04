import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { createUser } from './factory/user.factory';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockRepository = {
    create: jest.fn().mockImplementation((userDto) => createUser(userDto)),
    save: jest.fn().mockImplementation((userDto) => createUser(userDto)),
    findOne: jest.fn().mockResolvedValue(createUser()),
    find: jest.fn().mockResolvedValue([createUser(), createUser()]),
    findOneBy: jest.fn().mockResolvedValue(createUser()),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
    update: jest.fn().mockResolvedValue({ affected: 1 })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDto = { id: 1, username: 'johndoe', full_name: 'John Doe', password: 'password123' };
      const mockUser = createUser(userDto);

      const result = await service.create(userDto);
      expect(userRepository.save).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      let mockUsers = [createUser(), createUser()] as any;
      mockUsers = mockUsers.map(mockUser => plainToClass(UserDto, mockUser, { excludeExtraneousValues: true }))

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(mockUsers);
      const result = await service.findAll(0, 10);

      expect(userRepository.find).toHaveBeenCalledWith({ skip: 0, take: 10 });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const mockUser = createUser({ id: userId });

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
      const result = await service.findOneby({ id: userId });

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      let mockUser = createUser({ id: userId }) as any;
      mockUser = plainToClass(UserDto, mockUser, { excludeExtraneousValues: true })

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

      const result = await service.findOne(userId);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const userId = -1;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
      try {
        await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateDto = { full_name: 'John Updated' };
      const mockUser = createUser({ id: userId, ...updateDto });
      delete mockUser.password;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);

      const result = await service.update(userId, updateDto);

      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('full_name', 'John Updated');
    });

    it('should throw an error if user is not found', async () => {
      const userId = -1;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      try {
        await expect(service.update(userId, {})).rejects.toThrow(NotFoundException)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = 1;
      const mockUser = createUser({ id: userId });

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
      const result = await service.remove(userId);

      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw an error if user is not found', async () => {
      const userId = -1;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
      try {
        await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
