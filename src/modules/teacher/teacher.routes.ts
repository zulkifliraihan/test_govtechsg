    import { Router } from 'express'
import { TeacherRepository } from './teacher.repository'
import { TeacherService } from './teacher.service'
import { TeacherController } from './teacher.controller'
import { validate } from '../../middlewares/validate'
import { emailSchema, updateTeacherSchema } from './teacher.validation'

const router = Router()

const teacherRepository = new TeacherRepository()
const teacherService = new TeacherService(teacherRepository)
const teacherController = new TeacherController(teacherService)

router.get('/', teacherController.getAll)
router.post('/email', validate(emailSchema), teacherController.getByEmail)
router.get('/:id', teacherController.getById)
router.post('/', validate(emailSchema), teacherController.create)
router.put('/:id', validate(updateTeacherSchema), teacherController.update)
router.delete('/:id', teacherController.delete)

export default router
