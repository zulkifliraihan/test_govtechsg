import { prisma } from '../../config/prisma'
import { ITeacher, ICreateTeacher, ITeacherRepository, ITeacherResult, IUpdateTeacher } from './teacher.interface'

export class TeacherRepository implements ITeacherRepository {
  async findAll(includeStudents?: boolean): Promise<ITeacherResult[]> {
    if (!includeStudents) return prisma.teacher.findMany()

    const teachers = await prisma.teacher.findMany({
      include: {
        teacherStudents: { include: { student: true } },
      },
    })

    return teachers.map(t => ({
      id: t.id,
      email: t.email,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      students: t.teacherStudents.map(ts => ({
        id: ts.student.id,
        email: ts.student.email,
        is_suspended: ts.student.is_suspended,
      })),
    }))
  }

  async findById(id: number, includeStudents?: boolean): Promise<ITeacherResult | null> {
    if (!includeStudents) return prisma.teacher.findUnique({ where: { id } })

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        teacherStudents: { include: { student: true } },
      },
    })

    if (!teacher) return null

    return {
      id: teacher.id,
      email: teacher.email,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      students: teacher.teacherStudents.map(ts => ({
        id: ts.student.id,
        email: ts.student.email,
        is_suspended: ts.student.is_suspended,
      })),
    }
  }

  async findByEmail(email: string, includeStudents?: boolean): Promise<ITeacherResult | null> {
    if (!includeStudents) return prisma.teacher.findFirst({ where: { email } })

    const teacher = await prisma.teacher.findFirst({
      where: { email },
      include: {
        teacherStudents: { include: { student: true } },
      },
    })

    if (!teacher) return null

    return {
      id: teacher.id,
      email: teacher.email,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      students: teacher.teacherStudents.map(ts => ({
        id: ts.student.id,
        email: ts.student.email,
        is_suspended: ts.student.is_suspended,
      })),
    }
  }

  async create(data: ICreateTeacher): Promise<ITeacher> {
    return prisma.teacher.create({ data })
  }

  async update(id: number, data: IUpdateTeacher): Promise<ITeacher> {
    return prisma.teacher.update({ where: { id }, data })
  }

  async delete(id: number): Promise<void> {
    await prisma.teacher.delete({ where: { id } })
  }
}
