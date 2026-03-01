import { prisma } from '../../config/prisma'
import { ITeacherStudentRepository, ITeacherWithStudents } from './teacher-student.interface'

export class TeacherStudentRepository implements ITeacherStudentRepository {
  async findTeacherByEmail(email: string): Promise<{ id: number } | null> {
    return prisma.teacher.findFirst({ where: { email }, select: { id: true } })
  }

  async findStudentsByEmails(emails: string[]): Promise<{ id: number; email: string }[]> {
    return prisma.student.findMany({
      where: { email: { in: emails } },
      select: { id: true, email: true },
    })
  }

  async findExistingRelations(teacherId: number, studentIds: number[]): Promise<{ student_id: number }[]> {
    return prisma.teacherStudent.findMany({
      where: { teacher_id: teacherId, student_id: { in: studentIds } },
      select: { student_id: true },
    })
  }

  async createRelations(data: { teacher_id: number; student_id: number }[]): Promise<void> {
    await prisma.teacherStudent.createMany({ data })
  }

  async findTeachersWithStudents(emails: string[]): Promise<ITeacherWithStudents[]> {
    return prisma.teacher.findMany({
      where: { email: { in: emails } },
      select: {
        email: true,
        teacherStudents: {
          select: { student: { select: { email: true } } },
        },
      },
    })
  }

  async findStudentByEmail(email: string): Promise<{ id: number } | null> {
    return prisma.student.findFirst({ where: { email }, select: { id: true } })
  }

  async updateStudentSuspendStatus(studentId: number): Promise<void> {
    await prisma.student.update({
      where: { id: studentId },
      data: { is_suspended: true },
    })
  }

  async findActiveRegisteredStudentsByTeacherId(teacherId: number): Promise<{ email: string }[]> {
    const relations = await prisma.teacherStudent.findMany({
      where: {
        teacher_id: teacherId,
        student: { is_suspended: false },
      },
      select: { student: { select: { email: true } } },
    })
    return relations.map(r => ({ email: r.student.email }))
  }

  async findActiveStudentsByEmails(emails: string[]): Promise<{ email: string }[]> {
    return prisma.student.findMany({
      where: { email: { in: emails }, is_suspended: false },
      select: { email: true },
    })
  }
}
