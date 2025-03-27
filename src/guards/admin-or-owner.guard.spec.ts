import { UsersService } from "../user/user.service";
import { AdminOrOwnerGuard } from "./admin-or-owner.guard";
import { Test, TestingModule } from "@nestjs/testing";

describe('AdminOrOwnerGuard', () => {
  let guard: AdminOrOwnerGuard;
  let usersService: UsersService;

  // Mock UsersService
  const mockUsersService = {
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminOrOwnerGuard,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    guard = module.get<AdminOrOwnerGuard>(AdminOrOwnerGuard);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
