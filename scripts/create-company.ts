import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const company = await prisma.company.create({
    data: {
      name: '하엘프랜즈',
    },
  })
  console.log('생성된 회사:', company)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 