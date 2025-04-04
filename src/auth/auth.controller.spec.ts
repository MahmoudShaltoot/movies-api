import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { createUser } from './factory/auth.factory';
import { UnauthorizedException } from '@nestjs/common';


describe('AuthController', () => {
  let controller: AuthController;
  let usersService: UsersService;
  let authService: AuthService;

  const mockUserRepository = {
    findOneBy: jest.fn().mockResolvedValue(createUser({ id: 1, username: 'test' })),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const user = { id: 1, username: 'test', full_name: 'test', password: 'P@ssw0rd' };
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(createUser());
      jest.spyOn(authService, 'login').mockImplementation(async ({ username, password }) => { return { access_token: 'mock-token' }});
  
      const result = await controller.register(user);
  
      expect(result).toBeDefined();
      expect(result).toHaveProperty('access_token');
    });
  })

  describe('login', () => {
    it('should login a user', async () => {
      const user = { id: 1, username: 'test', password: 'P@ssw0rd' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(createUser({ ...user }));
      jest.spyOn(authService, 'login').mockImplementation(async ({ username, password }) => { return { access_token: 'mock-token' }});
  
      const result = await controller.login(user);
  
      expect(result).toBeDefined();
      expect(result).toHaveProperty('access_token');
    });

    it('should throw an error if the user is not found', async () => {
      const user = { username: 'test', password: 'incorrect-password' };
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(authService, 'validateUser').mockImplementation(async (username, password) => null)

      await expect(controller.login(user)).rejects.toThrow(UnauthorizedException);
    });
  })
});
