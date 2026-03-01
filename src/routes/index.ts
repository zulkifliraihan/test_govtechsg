import { Router } from 'express'
import teacherRoutes from '../modules/teacher/teacher.routes'
import studentRoutes from '../modules/student/student.routes'
import teacherStudentRoutes from '../modules/teacher-student/teacher-student.routes'

const router = Router()

router.use('/teachers', teacherRoutes)
router.use('/students', studentRoutes)
router.use('/', teacherStudentRoutes)

export default router
