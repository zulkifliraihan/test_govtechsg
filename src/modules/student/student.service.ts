import { IStudent, ICreateStudent, IStudentRepository, IStudentResult, IUpdateStudent } from './student.interface'

export class StudentService {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async getAll(includeTeachers?: boolean): Promise<IStudentResult[]> {
    return this.studentRepository.findAll(includeTeachers)
  }

  async getById(id: number, includeTeachers?: boolean): Promise<IStudentResult> {
    const student = await this.studentRepository.findById(id, includeTeachers)
    if (!student) throw { status: 404, message: 'Student not found' }
    return student
  }

  async getByEmail(email: string, includeTeachers?: boolean): Promise<IStudentResult> {
    const student = await this.studentRepository.findByEmail(email, includeTeachers)
    if (!student) throw { status: 404, message: 'Student not found' }
    return student
  }

  async create(data: ICreateStudent): Promise<IStudent> {
    return this.studentRepository.create(data)
  }

  async update(id: number, data: IUpdateStudent): Promise<IStudent> {
    await this.getById(id)
    return this.studentRepository.update(id, data)
  }

  async delete(id: number): Promise<void> {
    await this.getById(id)
    await this.studentRepository.delete(id)
  }
}
