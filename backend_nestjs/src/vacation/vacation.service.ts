import { Injectable } from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';

@Injectable()
export class VacationService {
  create(dto: CreateVacationDto) {
    // 휴가 생성 로직
    return 'Vacation created';
  }

  findOne(id: number) {
    // 휴가 단건 조회 로직
    return `Vacation #${id}`;
  }

  update(id: number, dto: UpdateVacationDto) {
    // 휴가 정보 수정 로직
    return `Vacation #${id} updated`;
  }

  remove(id: number) {
    // 휴가 삭제 로직
    return `Vacation #${id} removed`;
  }
} 