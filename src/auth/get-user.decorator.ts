import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext): User => { // never -> not using
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
