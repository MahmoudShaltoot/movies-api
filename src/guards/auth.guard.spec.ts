import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let context: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, JwtService],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer token' },
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should return true if token is valid', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      return { id: 'user-id' };
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should return false if token is invalid', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });
    try {
      await guard.canActivate(context);
    } catch (e) {
      expect(e.message).toBe('Invalid token');
    }
  });

  it('should return false if token is missing', async () => {
    try {
      await guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: null },
          }),
        }),
      } as unknown as ExecutionContext);
    } catch (e) {
      expect(e.message).toBe('Authorization token is missing or invalid');
    }
  });
});
