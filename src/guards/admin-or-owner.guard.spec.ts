import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrOwnerGuard } from './admin-or-owner.guard';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AdminOrOwnerGuard', () => {
  let guard: AdminOrOwnerGuard;
  let jwtService: JwtService;
  let context: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOrOwnerGuard, JwtService],
    }).compile();

    guard = module.get<AdminOrOwnerGuard>(AdminOrOwnerGuard);
    jwtService = module.get<JwtService>(JwtService);
    context = {
      switchToHttp: () => ({
        getRequest: () =>
        ({
          params: { id: 'user-id' },
          headers: { authorization: 'Bearer token' },
          user: { id: 'user-id', isAdmin: true }
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should return true if user is admin', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      return { id: '', isAdmin: true };
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return true if user is owner', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      return { id: 'user-id', isAdmin: false };
    });

    context = {
      switchToHttp: () => ({
        getRequest: () =>
        ({
          params: { id: 'user-id' },
          headers: { authorization: 'Bearer token' },
          user: { id: 'user-id', isAdmin: false }
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return false if user is not admin or owner', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      return { id: '', isAdmin: false };
    });

    context = {
      switchToHttp: () => ({
        getRequest: () =>
        ({
          params: { id: 'user-id' },
          headers: { authorization: 'Bearer token' },
          user: { id: '', isAdmin: false }
        }),
      }),
    } as unknown as ExecutionContext;

    try {
      await guard.canActivate(context);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
    }
  });
});
