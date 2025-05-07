import { IsString, IsOptional, IsEmail, IsBoolean, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  role: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isCEO?: boolean;

  @IsInt()
  companyId: number;

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