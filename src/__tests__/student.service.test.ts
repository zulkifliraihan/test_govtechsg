import { StudentService } from '../modules/student/student.service'
import { IStudentRepository, IStudentResult, IStudent } from '../modules/student/student.interface'

const mockDate = new Date('2026-02-28T07:19:56.445Z')

const makeRepo = (overrides: Partial<IStudentRepository> = {}): IStudentRepository => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  ...overrides,
})

const student1: IStudentResult = {
  id: 1,
  email: 'student1@example.com',
  is_suspended: false,
  createdAt: mockDate,
  updatedAt: mockDate,
}

const student3: IStudentResult = {
  id: 3,
  email: 'student3@example.com',
  is_suspended: true,
  createdAt: mockDate,
  updatedAt: mockDate,
}

const student1WithTeachers: IStudentResult = {
  ...student1,
  teachers: [
    { id: 1, email: 'teacher1@example.com' },
    { id: 2, email: 'teacher2@example.com' },
  ],
}

describe('StudentService', () => {
  describe('getAll', () => {
    it('should return all students', async () => {
      const repo = makeRepo({ findAll: jest.fn().mockResolvedValue([student1, student3]) })
      const service = new StudentService(repo)

      const result = await service.getAll()

      expect(repo.findAll).toHaveBeenCalledWith(undefined)
      expect(result).toHaveLength(2)
    })

    it('should return students with teachers when include_teachers is true', async () => {
      const repo = makeRepo({ findAll: jest.fn().mockResolvedValue([student1WithTeachers]) })
      const service = new StudentService(repo)

      const result = await service.getAll(true)

      expect(repo.findAll).toHaveBeenCalledWith(true)
      expect(result[0].teachers).toHaveLength(2)
    })
  })

  describe('getById', () => {
    it('should return a student by id', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(student1) })
      const service = new StudentService(repo)

      const result = await service.getById(1)

      expect(repo.findById).toHaveBeenCalledWith(1, undefined)
      expect(result).toEqual(student1)
    })

    it('should return student with teachers when include_teachers is true', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(student1WithTeachers) })
      const service = new StudentService(repo)

      const result = await service.getById(1, true)

      expect(repo.findById).toHaveBeenCalledWith(1, true)
      expect(result.teachers).toHaveLength(2)
    })

    it('should throw 404 when student is not found', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) })
      const service = new StudentService(repo)

      await expect(service.getById(9)).rejects.toMatchObject({
        status: 404,
        message: 'Student not found',
      })
    })
  })

  describe('getByEmail', () => {
    it('should return a student by email', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(student1) })
      const service = new StudentService(repo)

      const result = await service.getByEmail('student1@example.com')

      expect(repo.findByEmail).toHaveBeenCalledWith('student1@example.com', undefined)
      expect(result).toEqual(student1)
    })

    it('should return student with teachers when include_teachers is true', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(student1WithTeachers) })
      const service = new StudentService(repo)

      const result = await service.getByEmail('student1@example.com', true)

      expect(result.teachers).toHaveLength(2)
    })

    it('should throw 404 when student email is not found', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(null) })
      const service = new StudentService(repo)

      await expect(service.getByEmail('notfound@example.com')).rejects.toMatchObject({
        status: 404,
        message: 'Student not found',
      })
    })
  })

  describe('create', () => {
    it('should create and return a new student', async () => {
      const newStudent: IStudent = {
        id: 4,
        email: 'student4@example.com',
        is_suspended: false,
        createdAt: mockDate,
        updatedAt: mockDate,
      }
      const repo = makeRepo({ create: jest.fn().mockResolvedValue(newStudent) })
      const service = new StudentService(repo)

      const result = await service.create({ email: 'student4@example.com' })

      expect(repo.create).toHaveBeenCalledWith({ email: 'student4@example.com' })
      expect(result).toEqual(newStudent)
    })
  })

  describe('update', () => {
    it('should update and return the student', async () => {
      const updated: IStudent = {
        id: 4,
        email: 'student4@example.com',
        is_suspended: true,
        createdAt: mockDate,
        updatedAt: mockDate,
      }
      const repo = makeRepo({
        findById: jest.fn().mockResolvedValue(student1),
        update: jest.fn().mockResolvedValue(updated),
      })
      const service = new StudentService(repo)

      const result = await service.update(4, { is_suspended: true })

      expect(repo.update).toHaveBeenCalledWith(4, { is_suspended: true })
      expect(result.is_suspended).toBe(true)
    })

    it('should throw 404 when updating a non-existent student', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) })
      const service = new StudentService(repo)

      await expect(service.update(9, { is_suspended: true })).rejects.toMatchObject({
        status: 404,
        message: 'Student not found',
      })
    })
  })

  describe('delete', () => {
    it('should delete the student', async () => {
      const repo = makeRepo({
        findById: jest.fn().mockResolvedValue(student1),
        delete: jest.fn().mockResolvedValue(undefined),
      })
      const service = new StudentService(repo)

      await service.delete(1)

      expect(repo.delete).toHaveBeenCalledWith(1)
    })

    it('should throw 404 when deleting a non-existent student', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(null) })
      const service = new StudentService(repo)

      await expect(service.delete(9)).rejects.toMatchObject({
        status: 404,
        message: 'Student not found',
      })
    })
  })
})
