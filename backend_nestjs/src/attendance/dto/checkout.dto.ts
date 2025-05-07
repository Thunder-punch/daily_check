import { IsInt } from 'class-validator';

export class CheckOutDto {
  @IsInt()
  userId: number;

  @IsInt()
  companyId: number;
} 