import { ITeacher, ICreateTeacher, ITeacherRepository, ITeacherResult, IUpdateTeacher } from './teacher.interface'

export class TeacherService {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async getAll(includeStudents?: boolean): Promise<ITeacherResult[]> {
    return this.teacherRepository.findAll(includeStudents)
  }

  async getById(id: number, includeStudents?: boolean): Promise<ITeacherResult> {
    const teacher = await this.teacherRepository.findById(id, includeStudents)
    if (!teacher) throw { status: 404, message: 'Teacher not found' }
    return teacher
  }

  async getByEmail(email: string, includeStudents?: boolean): Promise<ITeacherResult> {
    const teacher = await this.teacherRepository.findByEmail(email, includeStudents)
    if (!teacher) throw { status: 404, message: 'Teacher not found' }
    return teacher
  }

  async create(data: ICreateTeacher): Promise<ITeacher> {
    return this.teacherRepository.create(data)
  }

  async update(id: number, data: IUpdateTeacher): Promise<ITeacher> {
    await this.getById(id)
    return this.teacherRepository.update(id, data)
  }

  async delete(id: number): Promise<void> {
    await this.getById(id)
    await this.teacherRepository.delete(id)
  }
}
