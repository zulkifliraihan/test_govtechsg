import { prisma } from '../../config/prisma'

const teachers = [
  { email: 'teacher1@example.com' },
  { email: 'teacher2@example.com' },
  { email: 'teacher3@example.com' },
]

export const teacherSeeder = async () => {
  await prisma.teacher.createMany({
    data: teachers,
    skipDuplicates: true,
  })

  console.log(`Seeded ${teachers.length} teachers`)
}
