import { AdminOrOwnerGuard } from "./admin-or-owner.guard";

describe('AdminOrOwnerGuard', () => {
  it('should be defined', () => {
    expect(new AdminOrOwnerGuard()).toBeDefined();
  });
});
