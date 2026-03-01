import { Request, Response } from 'express'
import { StudentService } from './student.service'

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const includeTeachers = req.query.include_teachers === 'true'
      const students = await this.studentService.getAll(includeTeachers)
      res.json({ data: students })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  getByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body
      const includeTeachers = req.query.include_teachers === 'true'
      const student = await this.studentService.getByEmail(email, includeTeachers)
      res.json({ data: student })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const includeTeachers = req.query.include_teachers === 'true'
      const student = await this.studentService.getById(id, includeTeachers)
      res.json({ data: student })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await this.studentService.create(req.body)
      res.status(201).json({ data: student })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const student = await this.studentService.update(id, req.body)
      res.json({ data: student })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id)
      await this.studentService.delete(id)
      res.status(204).json({ message: 'Student deleted successfully' })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }
}
