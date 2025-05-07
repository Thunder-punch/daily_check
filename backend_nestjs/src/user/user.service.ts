import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(dto: CreateUserDto) {
    // 사용자 생성 로직
    return 'User created';
  }

  findOne(id: number) {
    // 사용자 단건 조회 로직
    return `User #${id}`;
  }

  update(id: number, dto: UpdateUserDto) {
    // 사용자 정보 수정 로직
    return `User #${id} updated`;
  }

  remove(id: number) {
    // 사용자 삭제 로직
    return `User #${id} removed`;
  }
} 