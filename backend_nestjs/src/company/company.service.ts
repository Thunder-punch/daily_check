import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  create(dto: CreateCompanyDto) {
    // 회사 생성 로직
    return 'Company created';
  }

  findOne(id: number) {
    // 회사 단건 조회 로직
    return `Company #${id}`;
  }

  update(id: number, dto: UpdateCompanyDto) {
    // 회사 정보 수정 로직
    return `Company #${id} updated`;
  }

  remove(id: number) {
    // 회사 삭제 로직
    return `Company #${id} removed`;
  }
} 