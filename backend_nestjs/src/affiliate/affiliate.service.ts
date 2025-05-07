import { Injectable } from '@nestjs/common';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';

@Injectable()
export class AffiliateService {
  create(dto: CreateAffiliateDto) {
    // 제휴사 생성 로직
    return 'Affiliate created';
  }

  findOne(id: number) {
    // 제휴사 단건 조회 로직
    return `Affiliate #${id}`;
  }

  update(id: number, dto: UpdateAffiliateDto) {
    // 제휴사 정보 수정 로직
    return `Affiliate #${id} updated`;
  }

  remove(id: number) {
    // 제휴사 삭제 로직
    return `Affiliate #${id} removed`;
  }
} 