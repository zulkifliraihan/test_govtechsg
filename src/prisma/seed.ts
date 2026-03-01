import { prisma } from '../config/prisma'
import { teacherSeeder } from './seeders/teacher.seeder'
import { studentSeeder } from './seeders/student.seeder'

const main = async () => {
  await teacherSeeder()
  await studentSeeder()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
