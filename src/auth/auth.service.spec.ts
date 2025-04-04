import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { createUser } from './factory/auth.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersRepository = {
    findOneBy: jest.fn().mockResolvedValue({ id: 1, username: 'test', password: 'P@ssw0rd' }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [AuthService, UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const cred = { username: 'test', password: 'P@ssw0rd' };
      const user = createUser({ ...cred });
      jest.spyOn(usersService, 'findOneby').mockResolvedValue(user);

      const result = await service.validateUser(cred.username, cred.password);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
    });

    it('should throw an error if the user is not found', async () => {
      const cred = { username: 'not-found', password: 'incorrect-password' };
      jest.spyOn(usersService, 'findOneby').mockResolvedValue(null);

      await expect(service.validateUser(cred.username, cred.password)).rejects.toThrow(NotFoundException);
    })

    it('should throw an error if the password is incorrect', async () => {
      const cred = { username: 'test', password: 'incorrect-password' };
      const user = createUser({ password: 'P@ssw0rd' });
      jest.spyOn(usersService, 'findOneby').mockResolvedValue(user);

      await expect(service.validateUser(cred.username, cred.password)).rejects.toThrow(BadRequestException);
    })
  })

  describe('login', () => {
    it('should login a user', async () => {
      const user = createUser();

      const result = await service.login(user);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('access_token');
    });
  })

  describe('register', () => {
    it('should register a user', async () => {
      const user = { id: 1, username: 'test', full_name: 'test', password: 'P@ssw0rd' };
      jest.spyOn(mockUsersRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(createUser());
      jest.spyOn(service, 'login').mockImplementation(async ({ username, password }) => { return { access_token: 'mock-token' }});
  
      const result = await service.register(user);
  
      expect(result).toBeDefined();
      expect(result).toHaveProperty('access_token');
    });

    it('should throw an error if the user already exists', async () => {
      const user = { id: 1, username: 'existing-user', full_name: 'test', password: 'P@ssw0rd' };
      jest.spyOn(mockUsersRepository, 'findOneBy').mockResolvedValue(createUser());

      await expect(service.register(user)).rejects.toThrow(BadRequestException);
    });
  })
});
