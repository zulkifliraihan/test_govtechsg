import { Request, Response } from 'express'
import { TeacherService } from './teacher.service'

export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const includeStudents = req.query.include_students === 'true'
      const teachers = await this.teacherService.getAll(includeStudents)
      res.json({ data: teachers })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  getByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body
      const includeStudents = req.query.include_students === 'true'
      const teacher = await this.teacherService.getByEmail(email, includeStudents)
      res.json({ data: teacher })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const includeStudents = req.query.include_students === 'true'
      const teacher = await this.teacherService.getById(id, includeStudents)
      res.json({ data: teacher })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacher = await this.teacherService.create(req.body)
      res.status(201).json({ data: teacher })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const teacher = await this.teacherService.update(id, req.body)
      res.json({ data: teacher })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id)
      await this.teacherService.delete(id)
      res.json({ message: 'Teacher deleted successfully' })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }
}
