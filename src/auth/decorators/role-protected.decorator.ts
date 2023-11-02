import { Reflector } from '@nestjs/core';
import { ValidRoles } from '../enum/valid-roles.enum';

export const Roles = Reflector.createDecorator<ValidRoles[]>();
