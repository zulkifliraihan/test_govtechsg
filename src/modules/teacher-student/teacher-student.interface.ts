export interface IRegisterStudents {
  teacher: string
  students: string[]
}

export interface ITeacherWithStudents {
  email: string
  teacherStudents: {
    student: { email: string }
  }[]
}

export interface ITeacherStudentRepository {
  findTeacherByEmail(email: string): Promise<{ id: number } | null>
  findStudentsByEmails(emails: string[]): Promise<{ id: number; email: string }[]>
  findExistingRelations(teacherId: number, studentIds: number[]): Promise<{ student_id: number }[]>
  createRelations(data: { teacher_id: number; student_id: number }[]): Promise<void>
  findTeachersWithStudents(emails: string[]): Promise<ITeacherWithStudents[]>
  findStudentByEmail(email: string): Promise<{ id: number } | null>
  updateStudentSuspendStatus(studentId: number): Promise<void>
  findActiveRegisteredStudentsByTeacherId(teacherId: number): Promise<{ email: string }[]>
  findActiveStudentsByEmails(emails: string[]): Promise<{ email: string }[]>
}
