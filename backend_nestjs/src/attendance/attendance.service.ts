import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckInDto } from './dto/checkin.dto';
import { CheckOutDto } from './dto/checkout.dto';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  // 출근 기록 생성
  async checkIn(data: CheckInDto) {
    // 회사/사용자 확인
    const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) throw new NotFoundException('회사 정보가 없습니다.');
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new NotFoundException('사용자 정보가 없습니다.');
    // 오늘 출근 기록 있는지 확인
    const today = new Date();
    const record = await this.prisma.record.findFirst({
      where: {
        userId: user.id,
        companyId: company.id,
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });
    if (record) {
      throw new BadRequestException('이미 출근 기록이 있습니다.');
    }
    // 출근 기록 생성
    return this.prisma.record.create({
      data: {
        userId: user.id,
        companyId: company.id,
        date: today,
        checkIn: today,
        attendanceStatus: '출근',
      },
    });
  }

  // 퇴근 기록 생성
  async checkOut(data: CheckOutDto) {
    // 회사/사용자 확인
    const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) throw new NotFoundException('회사 정보가 없습니다.');
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new NotFoundException('사용자 정보가 없습니다.');
    // 오늘 출근 기록 찾기
    const today = new Date();
    const record = await this.prisma.record.findFirst({
      where: {
        userId: user.id,
        companyId: company.id,
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        checkOut: null,
      },
    });
    if (!record) {
      throw new NotFoundException('출근 기록이 없습니다.');
    }
    // 퇴근 시간 업데이트
    return this.prisma.record.update({
      where: { id: record.id },
      data: { checkOut: today, attendanceStatus: '퇴근' },
    });
  }

  // 날짜별 출석 조회
  async getAttendanceByDate(date: string) {
    const target = new Date(date);
    const records = await this.prisma.record.findMany({
      where: {
        date: {
          gte: startOfDay(target),
          lte: endOfDay(target),
        },
      },
      include: {
        user: { include: { company: true } },
      },
      orderBy: { checkIn: 'asc' },
    });
    return records;
  }
}
