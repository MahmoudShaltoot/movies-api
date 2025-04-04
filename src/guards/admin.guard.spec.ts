import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from './admin.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let context: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminGuard, JwtService, AuthGuard],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
    jwtService = module.get<JwtService>(JwtService);
    authGuard = module.get<AuthGuard>(AuthGuard);

    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer token' },
          user: { isAdmin: true }
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should return true if token is valid and user is admin', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      return { id: 'user-id', isAdmin: true };
    });

    const isAuthenticated = await guard.canActivate(context);
    expect(isAuthenticated).toBe(true);
  });

  it('should return false if user is not authenticated', async () => {
    jest.spyOn(guard, 'canActivate').mockImplementationOnce(() => false);

    const isAuthenticated = await guard.canActivate(context);
    expect(isAuthenticated).toBe(false);
  });

  it('should return false if token is valid but user is not admin', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      return { id: 'user-id', isAdmin: false };
    });

    try {
      await expect(guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer token' },
            user: { isAdmin: false },
          }),
        }),
      } as unknown as ExecutionContext)).rejects.toThrow(ForbiddenException);

    } catch (e) {
      expect(e.message).toBe('Forbidden action!');
    }
  });
});