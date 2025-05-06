import { IsString } from 'class-validator';

export class CheckOutDto {
  @IsString()
  name: string;

  @IsString()
  company: string;
} 