export interface IStudent {
  id: number
  email: string
  is_suspended: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IStudentTeacher {
  id: number
  email: string
}

export interface IStudentResult extends IStudent {
  teachers?: IStudentTeacher[]
}

export interface ICreateStudent {
  email: string
  is_suspended?: boolean
}

export interface IUpdateStudent {
  email?: string
  is_suspended?: boolean
}

export interface IStudentRepository {
  findAll(includeTeachers?: boolean): Promise<IStudentResult[]>
  findById(id: number, includeTeachers?: boolean): Promise<IStudentResult | null>
  findByEmail(email: string, includeTeachers?: boolean): Promise<IStudentResult | null>
  create(data: ICreateStudent): Promise<IStudent>
  update(id: number, data: IUpdateStudent): Promise<IStudent>
  delete(id: number): Promise<void>
}
