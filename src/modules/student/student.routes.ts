import { Router } from 'express'
import { StudentRepository } from './student.repository'
import { StudentService } from './student.service'
import { StudentController } from './student.controller'
import { validate } from '../../middlewares/validate'
import { emailSchema, updateStudentSchema } from './student.validation'

const router = Router()

const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService)

router.get('/', studentController.getAll)
router.post('/email', validate(emailSchema), studentController.getByEmail)
router.get('/:id', studentController.getById)
router.post('/', validate(emailSchema), studentController.create)
router.put('/:id', validate(updateStudentSchema), studentController.update)
router.delete('/:id', studentController.delete)

export default router
