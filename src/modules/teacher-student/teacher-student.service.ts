import { ITeacherStudentRepository } from './teacher-student.interface'

export class TeacherStudentService {
  constructor(private readonly teacherStudentRepository: ITeacherStudentRepository) {}

  async registerStudents(teacherEmail: string, studentEmails: string[]): Promise<void> {
    const teacher = await this.teacherStudentRepository.findTeacherByEmail(teacherEmail)
    if (!teacher) throw { status: 404, message: `Teacher ${teacherEmail} not found` }

    const students = await this.teacherStudentRepository.findStudentsByEmails(studentEmails)

    const foundEmails = students.map(s => s.email)
    const notFound = studentEmails.filter(e => !foundEmails.includes(e))
    if (notFound.length > 0) {
      throw { status: 404, message: `Students not found: ${notFound.join(', ')}` }
    }

    const existingRelations = await this.teacherStudentRepository.findExistingRelations(
      teacher.id,
      students.map(s => s.id)
    )

    const existingStudentIds = new Set(existingRelations.map(r => r.student_id))
    const newStudents = students.filter(s => !existingStudentIds.has(s.id))

    if (newStudents.length > 0) {
      await this.teacherStudentRepository.createRelations(
        newStudents.map(s => ({ teacher_id: teacher.id, student_id: s.id }))
      )
    }
  }

  async getCommonStudents(teacherEmails: string[]): Promise<string[]> {
    if (teacherEmails.length === 0) throw { status: 400, message: 'At least one teacher email is required' }

    const teachers = await this.teacherStudentRepository.findTeachersWithStudents(teacherEmails)

    const notFound = teacherEmails.filter(email => !teachers.some(t => t.email === email))
    if (notFound.length > 0) {
      throw { status: 404, message: `Teachers not found: ${notFound.join(', ')}` }
    }

    const studentSets = teachers.map(
      teacher => new Set(teacher.teacherStudents.map(ts => ts.student.email))
    )

    const [first, ...rest] = studentSets
    return [...first].filter(email => rest.every(set => set.has(email)))
  }

  async getNotificationRecipients(teacherEmail: string, notification: string): Promise<string[]> {
    const teacher = await this.teacherStudentRepository.findTeacherByEmail(teacherEmail)
    if (!teacher) throw { status: 404, message: `Teacher ${teacherEmail} not found` }

    const mentionRegex = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    const mentionedEmails: string[] = []
    let match
    while ((match = mentionRegex.exec(notification)) !== null) {
      mentionedEmails.push(match[1])
    }

    const [registeredStudents, mentionedStudents] = await Promise.all([
      this.teacherStudentRepository.findActiveRegisteredStudentsByTeacherId(teacher.id),
      mentionedEmails.length > 0
        ? this.teacherStudentRepository.findActiveStudentsByEmails(mentionedEmails)
        : Promise.resolve([]),
    ])

    const recipients = new Set([
      ...registeredStudents.map(s => s.email),
      ...mentionedStudents.map(s => s.email),
    ])

    return [...recipients]
  }

  async suspendStudent(studentEmail: string): Promise<void> {
    const student = await this.teacherStudentRepository.findStudentByEmail(studentEmail)
    if (!student) throw { status: 404, message: `Student ${studentEmail} not found` }

    await this.teacherStudentRepository.updateStudentSuspendStatus(student.id)
  }
}
