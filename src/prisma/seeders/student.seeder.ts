import { prisma } from '../../config/prisma'

const students = [
  { email: 'student1@example.com', is_suspended: false },
  { email: 'student2@example.com', is_suspended: false },
  { email: 'student3@example.com', is_suspended: true },
]

export const studentSeeder = async () => {
  await prisma.student.createMany({
    data: students,
    skipDuplicates: true,
  })

  console.log(`Seeded ${students.length} students`)
}
