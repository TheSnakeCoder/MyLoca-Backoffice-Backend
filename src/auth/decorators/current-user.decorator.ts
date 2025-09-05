import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserType {
  id: string;
  username: string;
  isActive: boolean;
  addedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserType | undefined, ctx: ExecutionContext): CurrentUserType | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserType;

    return data ? user?.[data] : user;
  },
);
