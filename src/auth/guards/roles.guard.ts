import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../entities/user.entity';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/role-protected.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger('RolesGuard');

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      Roles,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      this.logger.error(`Error, the UserRoleGuard no recibió un usuario.`);
      throw new BadRequestException(`User does not exist.`);
    }

    for (const role of user.roles) if (validRoles.includes(role)) return true;

    throw new ForbiddenException(
      `User ${user.fullname} need a valid role: [${validRoles}]`,
    );
  }
}
