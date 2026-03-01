import { TeacherService } from '../modules/teacher/teacher.service'
import { ITeacherRepository, ITeacherResult, ITeacher } from '../modules/teacher/teacher.interface'

const mockDate = new Date('2026-02-28T06:58:24.070Z')

const makeRepo = (overrides: Partial<ITeacherRepository> = {}): ITeacherRepository => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  ...overrides,
})

const teacher1: ITeacherResult = {
  id: 1,
  email: 'teacher1@example.com',
  createdAt: mockDate,
  updatedAt: mockDate,
}

const teacher1WithStudents: ITeacherResult = {
  ...teacher1,
  students: [
    { id: 1, email: 'student1@example.com', is_suspended: false },
    { id: 2, email: 'student2@example.com', is_suspended: false },
  ],
}

describe('TeacherService', () => {
  describe('getAll', () => {
    it('should return all teachers', async () => {
      const repo = makeRepo({ findAll: jest.fn().mockResolvedValue([teacher1]) })
      const service = new TeacherService(repo)

      const result = await service.getAll()

      expect(repo.findAll).toHaveBeenCalledWith(undefined)
      expect(result).toEqual([teacher1])
    })

    it('should return teachers with students when include_students is true', async () => {
      const repo = makeRepo({ findAll: jest.fn().mockResolvedValue([teacher1WithStudents]) })
      const service = new TeacherService(repo)

      const result = await service.getAll(true)

      expect(repo.findAll).toHaveBeenCalledWith(true)
      expect(result[0].students).toHaveLength(2)
    })
  })

  describe('getById', () => {
    it('should return a teacher by id', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(teacher1) })
      const service = new TeacherService(repo)

      const result = await service.getById(1)

      expect(repo.findById).toHaveBeenCalledWith(1, undefined)
      expect(result).toEqual(teacher1)
    })

    it('should return teacher with students when include_students is true', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(teacher1WithStudents) })
      const service = new TeacherService(repo)

      const result = await service.getById(1, true)

      expect(repo.findById).toHaveBeenCalledWith(1, true)
      expect(result.students).toHaveLength(2)
    })

    it('should throw 404 when teacher is not found', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) })
      const service = new TeacherService(repo)

      await expect(service.getById(5)).rejects.toMatchObject({
        status: 404,
        message: 'Teacher not found',
      })
    })
  })

  describe('getByEmail', () => {
    it('should return a teacher by email', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(teacher1) })
      const service = new TeacherService(repo)

      const result = await service.getByEmail('teacher1@example.com')

      expect(repo.findByEmail).toHaveBeenCalledWith('teacher1@example.com', undefined)
      expect(result).toEqual(teacher1)
    })

    it('should return teacher with students when include_students is true', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(teacher1WithStudents) })
      const service = new TeacherService(repo)

      const result = await service.getByEmail('teacher1@example.com', true)

      expect(result.students).toHaveLength(2)
    })

    it('should throw 404 when teacher email is not found', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(null) })
      const service = new TeacherService(repo)

      await expect(service.getByEmail('notfound@example.com')).rejects.toMatchObject({
        status: 404,
        message: 'Teacher not found',
      })
    })
  })

  describe('create', () => {
    it('should create and return a new teacher', async () => {
      const newTeacher: ITeacher = { id: 13, email: 'zuran2907@gmail.com', createdAt: mockDate, updatedAt: mockDate }
      const repo = makeRepo({ create: jest.fn().mockResolvedValue(newTeacher) })
      const service = new TeacherService(repo)

      const result = await service.create({ email: 'zuran2907@gmail.com' })

      expect(repo.create).toHaveBeenCalledWith({ email: 'zuran2907@gmail.com' })
      expect(result).toEqual(newTeacher)
    })
  })

  describe('update', () => {
    it('should update and return the teacher', async () => {
      const updated: ITeacher = { id: 13, email: 'zuran290701@gmail.com', createdAt: mockDate, updatedAt: mockDate }
      const repo = makeRepo({
        findById: jest.fn().mockResolvedValue(teacher1),
        update: jest.fn().mockResolvedValue(updated),
      })
      const service = new TeacherService(repo)

      const result = await service.update(13, { email: 'zuran290701@gmail.com' })

      expect(repo.update).toHaveBeenCalledWith(13, { email: 'zuran290701@gmail.com' })
      expect(result.email).toBe('zuran290701@gmail.com')
    })

    it('should throw 404 when updating a non-existent teacher', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) })
      const service = new TeacherService(repo)

      await expect(service.update(5, { email: 'x@example.com' })).rejects.toMatchObject({
        status: 404,
        message: 'Teacher not found',
      })
    })
  })

  describe('delete', () => {
    it('should delete the teacher', async () => {
      const repo = makeRepo({
        findById: jest.fn().mockResolvedValue(teacher1),
        delete: jest.fn().mockResolvedValue(undefined),
      })
      const service = new TeacherService(repo)

      await service.delete(1)

      expect(repo.delete).toHaveBeenCalledWith(1)
    })

    it('should throw 404 when deleting a non-existent teacher', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) })
      const service = new TeacherService(repo)

      await expect(service.delete(5)).rejects.toMatchObject({
        status: 404,
        message: 'Teacher not found',
      })
    })
  })
})
