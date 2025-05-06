import { IsString } from 'class-validator';

export class CheckInDto {
  @IsString()
  name: string;

  @IsString()
  company: string;
} 