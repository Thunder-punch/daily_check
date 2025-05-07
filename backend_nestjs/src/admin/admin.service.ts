import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  create(dto: CreateAdminDto) {
    // 관리자 생성 로직
    return 'Admin created';
  }

  findOne(id: number) {
    // 관리자 단건 조회 로직
    return `Admin #${id}`;
  }

  update(id: number, dto: UpdateAdminDto) {
    // 관리자 정보 수정 로직
    return `Admin #${id} updated`;
  }

  remove(id: number) {
    // 관리자 삭제 로직
    return `Admin #${id} removed`;
  }
} 