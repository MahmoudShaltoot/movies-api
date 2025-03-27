import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  // Mock JwtService
  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
