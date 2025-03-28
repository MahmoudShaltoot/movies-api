import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AdminOrOwnerGuard } from "./admin-or-owner.guard";
import { Test, TestingModule } from "@nestjs/testing";

describe('AdminOrOwnerGuard', () => {
  let guard: AdminOrOwnerGuard;
  let jwtService: JwtService;

  // Mock JwtService
  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminOrOwnerGuard,
        { provide: UsersService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<AdminOrOwnerGuard>(AdminOrOwnerGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
