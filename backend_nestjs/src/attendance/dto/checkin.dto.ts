import { IsInt } from 'class-validator';

export class CheckInDto {
  @IsInt()
  userId: number;

  @IsInt()
  companyId: number;
} 