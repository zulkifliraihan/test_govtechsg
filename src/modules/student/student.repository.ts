import { prisma } from '../../config/prisma'
import { IStudent, ICreateStudent, IStudentRepository, IStudentResult, IUpdateStudent } from './student.interface'

export class StudentRepository implements IStudentRepository {
  async findAll(includeTeachers?: boolean): Promise<IStudentResult[]> {
    if (!includeTeachers) return prisma.student.findMany()

    const students = await prisma.student.findMany({
      include: {
        teacherStudents: { include: { teacher: true } },
      },
    })

    return students.map(s => ({
      id: s.id,
      email: s.email,
      is_suspended: s.is_suspended,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      teachers: s.teacherStudents.map(ts => ({
        id: ts.teacher.id,
        email: ts.teacher.email,
      })),
    }))
  }

  async findById(id: number, includeTeachers?: boolean): Promise<IStudentResult | null> {
    if (!includeTeachers) return prisma.student.findUnique({ where: { id } })

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        teacherStudents: { include: { teacher: true } },
      },
    })

    if (!student) return null

    return {
      id: student.id,
      email: student.email,
      is_suspended: student.is_suspended,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      teachers: student.teacherStudents.map(ts => ({
        id: ts.teacher.id,
        email: ts.teacher.email,
      })),
    }
  }

  async findByEmail(email: string, includeTeachers?: boolean): Promise<IStudentResult | null> {
    if (!includeTeachers) return prisma.student.findFirst({ where: { email } })

    const student = await prisma.student.findFirst({
      where: { email },
      include: {
        teacherStudents: { include: { teacher: true } },
      },
    })

    if (!student) return null

    return {
      id: student.id,
      email: student.email,
      is_suspended: student.is_suspended,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      teachers: student.teacherStudents.map(ts => ({
        id: ts.teacher.id,
        email: ts.teacher.email,
      })),
    }
  }

  async create(data: ICreateStudent): Promise<IStudent> {
    return prisma.student.create({ data })
  }

  async update(id: number, data: IUpdateStudent): Promise<IStudent> {
    return prisma.student.update({ where: { id }, data })
  }

  async delete(id: number): Promise<void> {
    await prisma.student.delete({ where: { id } })
  }
}
