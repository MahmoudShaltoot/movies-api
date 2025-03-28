import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminOrOwnerGuard extends AuthGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isAuthenticated = super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    if (request.user.id == request.query.id || request.user.isAdmin) {
      return true;
    }
    throw new ForbiddenException();
  }
}
