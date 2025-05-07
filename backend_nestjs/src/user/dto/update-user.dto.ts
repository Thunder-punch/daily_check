import { IsString, IsOptional, IsEmail, IsBoolean, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isCEO?: boolean;

  @IsInt()
  @IsOptional()
  companyId?: number;

  @IsString()
  @IsOptional()
  joinStatus?: string;

  @IsString()
  @IsOptional()
  notificationSettings?: string;

  @IsString()
  @IsOptional()
  employeeStatus?: string;

  @IsString()
  @IsOptional()
  employeeNote?: string;
} 