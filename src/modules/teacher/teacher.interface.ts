export interface ITeacher {
  id: number
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface ITeacherStudent {
  id: number
  email: string
  is_suspended: boolean
}

export interface ITeacherResult extends ITeacher {
  students?: ITeacherStudent[]
}

export interface ICreateTeacher {
  email: string
}

export interface IUpdateTeacher {
  email?: string
}

export interface ITeacherRepository {
  findAll(includeStudents?: boolean): Promise<ITeacherResult[]>
  findById(id: number, includeStudents?: boolean): Promise<ITeacherResult | null>
  findByEmail(email: string, includeStudents?: boolean): Promise<ITeacherResult | null>
  create(data: ICreateTeacher): Promise<ITeacher>
  update(id: number, data: IUpdateTeacher): Promise<ITeacher>
  delete(id: number): Promise<void>
}
