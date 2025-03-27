import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findOne(request.params.id);
    if (user.id == request.user.id || request.user.idAdmin) {
      return true
    }
    throw new ForbiddenException()
  }
}
