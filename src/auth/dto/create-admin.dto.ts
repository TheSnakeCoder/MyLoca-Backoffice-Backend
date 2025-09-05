import { IsString, IsNotEmpty, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
