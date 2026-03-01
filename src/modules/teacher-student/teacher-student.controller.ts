import { Request, Response } from 'express'
import { TeacherStudentService } from './teacher-student.service'

export class TeacherStudentController {
  constructor(private readonly teacherStudentService: TeacherStudentService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teacher, students } = req.body
      await this.teacherStudentService.registerStudents(teacher, students)
      res.status(204).send()
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  getCommonStudents = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherParam = req.query.teacher
      const teacherEmails = Array.isArray(teacherParam)
        ? (teacherParam as string[])
        : [teacherParam as string]

      const students = await this.teacherStudentService.getCommonStudents(teacherEmails)
      res.json({ students })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  retrieveForNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teacher, notification } = req.body
      const recipients = await this.teacherStudentService.getNotificationRecipients(teacher, notification)
      res.json({ recipients })
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }

  suspend = async (req: Request, res: Response): Promise<void> => {
    try {
      const { student } = req.body
      await this.teacherStudentService.suspendStudent(student)
      res.status(204).send()
    } catch (err: any) {
      res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
    }
  }
}
