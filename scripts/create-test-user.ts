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

  // 테스트 사용자 계정 생성
  const testUsers = [
    {
      email: 'user1@hael.com',
      name: '홍길동',
      password: 'user123'
    },
    {
      email: 'user2@hael.com',
      name: '김철수',
      password: 'user123'
    },
    {
      email: 'user3@hael.com',
      name: '이영희',
      password: 'user123'
    }
  ]

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        companyId: company.id,
        role: Role.EMPLOYEE
      }
    })

    console.log('생성된 사용자 계정:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId
    })
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