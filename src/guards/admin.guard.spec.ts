import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard';
import { Test, TestingModule } from '@nestjs/testing';

describe('AdminGuard', () => {
    let adminGuard: AdminGuard;
    let jwtService: JwtService;
  
    // Mock JwtService
    const mockJwtService = {
      verify: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AdminGuard,
          { provide: JwtService, useValue: mockJwtService },
        ],
      }).compile();
  
      adminGuard = module.get<AdminGuard>(AdminGuard);
      jwtService = module.get<JwtService>(JwtService);
    });

  it('should be defined', () => {
    expect(adminGuard).toBeDefined();
  });
});
