import { Router } from 'express'
import { TeacherStudentRepository } from './teacher-student.repository'
import { TeacherStudentService } from './teacher-student.service'
import { TeacherStudentController } from './teacher-student.controller'
import { validate, validateQuery } from '../../middlewares/validate'
import { registerSchema, suspendSchema, notificationSchema, commonStudentsQuerySchema } from './teacher-student.validation'

const router = Router()

const teacherStudentRepository = new TeacherStudentRepository()
const teacherStudentService = new TeacherStudentService(teacherStudentRepository)
const teacherStudentController = new TeacherStudentController(teacherStudentService)

router.post('/register', validate(registerSchema), teacherStudentController.register)
router.get('/commonstudents', validateQuery(commonStudentsQuerySchema), teacherStudentController.getCommonStudents)
router.post('/suspend', validate(suspendSchema), teacherStudentController.suspend)
router.post('/retrievefornotifications', validate(notificationSchema), teacherStudentController.retrieveForNotifications)

export default router
