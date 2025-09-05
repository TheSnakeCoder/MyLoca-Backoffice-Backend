import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserType } from './current-user.decorator';

export const GetCurrentUser = createParamDecorator(
  (data: keyof CurrentUserType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserType;

    return data ? user?.[data] : user;
  },
);

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserType;
    return user.id;
  },
);
