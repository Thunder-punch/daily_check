import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 하엘프랜즈 회사 ID 조회
  const company = await prisma.company.findFirst({
    where: {
      name: '하엘프랜즈'
    }
  })

  if (!company) {
    throw new Error('하엘프랜즈 회사를 찾을 수 없습니다.')
  }

  // 비밀번호 해시화
  const password = 'admin123' // 초기 비밀번호
  const hashedPassword = await bcrypt.hash(password, 10)

  // 관리자 계정 생성
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hael.com',
      password: hashedPassword,
      name: '관리자',
      companyId: company.id,
      role: Role.ADMIN
    }
  })

  console.log('생성된 관리자 계정:', {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    companyId: admin.companyId
  })
  console.log('초기 비밀번호:', password)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 