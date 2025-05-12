import { PrismaClient, AttendanceStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 모든 사용자 조회
  const users = await prisma.user.findMany({
    where: {
      role: 'EMPLOYEE'
    }
  })

  // 오늘 날짜 기준으로 5일간의 기록 생성
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (const user of users) {
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // 10% 확률로 결근
      if (Math.random() < 0.1) {
        await prisma.attendance.create({
          data: {
            userId: user.id,
            date: date,
            status: AttendanceStatus.ABSENT,
            note: '테스트 데이터 - 결근'
          }
        })
        continue
      }

      // 출근 시간 (8:30 ~ 9:30 사이 랜덤)
      const checkInHour = 8 + (Math.random() < 0.7 ? 0 : 1)  // 70% 확률로 8시대 출근
      const checkInMinute = Math.floor(Math.random() * 60)
      const checkIn = new Date(date.getFullYear(), date.getMonth(), date.getDate(), checkInHour, checkInMinute)

      // 퇴근 시간 (17:30 ~ 18:30 사이 랜덤)
      const checkOutHour = 17 + (Math.random() < 0.8 ? 1 : 0)  // 80% 확률로 18시대 퇴근
      const checkOutMinute = Math.floor(Math.random() * 60)
      const checkOut = new Date(date.getFullYear(), date.getMonth(), date.getDate(), checkOutHour, checkOutMinute)

      // 상태 결정 (지각, 정상, 조퇴)
      let status: AttendanceStatus = AttendanceStatus.NORMAL
      if (checkInHour === 9 && checkInMinute > 0) {
        status = AttendanceStatus.LATE
      }
      if (checkOutHour < 18) {
        status = AttendanceStatus.EARLY_LEAVE
      }

      const attendance = await prisma.attendance.create({
        data: {
          userId: user.id,
          date: date,
          checkIn: checkIn,
          checkOut: checkOut,
          status: status,
          note: status !== AttendanceStatus.NORMAL ? '테스트 데이터' : null
        }
      })

      console.log('생성된 출퇴근 기록:', {
        userId: attendance.userId,
        userName: user.name,
        date: attendance.date.toLocaleDateString(),
        checkIn: attendance.checkIn?.toLocaleTimeString(),
        checkOut: attendance.checkOut?.toLocaleTimeString(),
        status: attendance.status
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 