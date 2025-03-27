import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard extends AuthGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isAuthenticated = super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }
    
    const request = context.switchToHttp().getRequest();
    if (!request.user.isAdmin) {
      console.log(request.user);
      throw new ForbiddenException('Forbidden action!');
    }
    return true;
  }
}
