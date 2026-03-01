import { TeacherStudentService } from '../modules/teacher-student/teacher-student.service'
import { ITeacherStudentRepository } from '../modules/teacher-student/teacher-student.interface'

const makeRepo = (overrides: Partial<ITeacherStudentRepository> = {}): ITeacherStudentRepository => ({
  findTeacherByEmail: jest.fn(),
  findStudentsByEmails: jest.fn(),
  findExistingRelations: jest.fn(),
  createRelations: jest.fn(),
  findTeachersWithStudents: jest.fn(),
  findStudentByEmail: jest.fn(),
  updateStudentSuspendStatus: jest.fn(),
  findActiveRegisteredStudentsByTeacherId: jest.fn(),
  findActiveStudentsByEmails: jest.fn(),
  ...overrides,
})

// ─── Case 1: Register Students ───────────────────────────────────────────────

describe('TeacherStudentService - registerStudents (Case 1)', () => {
  it('should register students to a teacher successfully', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findStudentsByEmails: jest.fn().mockResolvedValue([
        { id: 1, email: 'student1@example.com' },
        { id: 2, email: 'student2@example.com' },
      ]),
      findExistingRelations: jest.fn().mockResolvedValue([]),
      createRelations: jest.fn().mockResolvedValue(undefined),
    })
    const service = new TeacherStudentService(repo)

    await service.registerStudents('teacher1@example.com', [
      'student1@example.com',
      'student2@example.com',
    ])

    expect(repo.createRelations).toHaveBeenCalledWith([
      { teacher_id: 1, student_id: 1 },
      { teacher_id: 1, student_id: 2 },
    ])
  })

  it('should skip already-registered students and only create new relations', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findStudentsByEmails: jest.fn().mockResolvedValue([
        { id: 1, email: 'student1@example.com' },
        { id: 2, email: 'student2@example.com' },
      ]),
      findExistingRelations: jest.fn().mockResolvedValue([{ student_id: 1 }]),
      createRelations: jest.fn().mockResolvedValue(undefined),
    })
    const service = new TeacherStudentService(repo)

    await service.registerStudents('teacher1@example.com', [
      'student1@example.com',
      'student2@example.com',
    ])

    expect(repo.createRelations).toHaveBeenCalledWith([{ teacher_id: 1, student_id: 2 }])
  })

  it('should not call createRelations when all students are already registered', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findStudentsByEmails: jest.fn().mockResolvedValue([
        { id: 1, email: 'student1@example.com' },
      ]),
      findExistingRelations: jest.fn().mockResolvedValue([{ student_id: 1 }]),
      createRelations: jest.fn(),
    })
    const service = new TeacherStudentService(repo)

    await service.registerStudents('teacher1@example.com', ['student1@example.com'])

    expect(repo.createRelations).not.toHaveBeenCalled()
  })

  it('should throw 404 when teacher is not found', async () => {
    const repo = makeRepo({ findTeacherByEmail: jest.fn().mockResolvedValue(null) })
    const service = new TeacherStudentService(repo)

    await expect(
      service.registerStudents('teacher9@example.com', ['student1@example.com'])
    ).rejects.toMatchObject({
      status: 404,
      message: 'Teacher teacher9@example.com not found',
    })
  })

  it('should throw 404 when one or more students are not found', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findStudentsByEmails: jest.fn().mockResolvedValue([
        { id: 1, email: 'student1@example.com' },
      ]),
    })
    const service = new TeacherStudentService(repo)

    await expect(
      service.registerStudents('teacher1@example.com', [
        'student1@example.com',
        'student9@example.com',
      ])
    ).rejects.toMatchObject({
      status: 404,
      message: 'Students not found: student9@example.com',
    })
  })
})

// ─── Case 2: Common Students ─────────────────────────────────────────────────

describe('TeacherStudentService - getCommonStudents (Case 2)', () => {
  it('should return students common to all specified teachers', async () => {
    const repo = makeRepo({
      findTeachersWithStudents: jest.fn().mockResolvedValue([
        {
          email: 'teacher1@example.com',
          teacherStudents: [
            { student: { email: 'student1@example.com' } },
            { student: { email: 'student2@example.com' } },
          ],
        },
        {
          email: 'teacher2@example.com',
          teacherStudents: [
            { student: { email: 'student1@example.com' } },
          ],
        },
      ]),
    })
    const service = new TeacherStudentService(repo)

    const result = await service.getCommonStudents([
      'teacher1@example.com',
      'teacher2@example.com',
    ])

    expect(result).toEqual(['student1@example.com'])
  })

  it('should return all students of a single teacher', async () => {
    const repo = makeRepo({
      findTeachersWithStudents: jest.fn().mockResolvedValue([
        {
          email: 'teacher1@example.com',
          teacherStudents: [
            { student: { email: 'student1@example.com' } },
            { student: { email: 'student2@example.com' } },
          ],
        },
      ]),
    })
    const service = new TeacherStudentService(repo)

    const result = await service.getCommonStudents(['teacher1@example.com'])

    expect(result).toEqual(['student1@example.com', 'student2@example.com'])
  })

  it('should throw 400 when no teacher emails are provided', async () => {
    const repo = makeRepo({ findTeachersWithStudents: jest.fn() })
    const service = new TeacherStudentService(repo)

    await expect(service.getCommonStudents([])).rejects.toMatchObject({
      status: 400,
      message: 'At least one teacher email is required',
    })
  })

  it('should throw 404 when a teacher is not found', async () => {
    const repo = makeRepo({
      findTeachersWithStudents: jest.fn().mockResolvedValue([
        {
          email: 'teacher2@example.com',
          teacherStudents: [],
        },
      ]),
    })
    const service = new TeacherStudentService(repo)

    await expect(
      service.getCommonStudents(['teacher9@example.com', 'teacher2@example.com'])
    ).rejects.toMatchObject({
      status: 404,
      message: 'Teachers not found: teacher9@example.com',
    })
  })
})

// ─── Case 3: Suspend Student ─────────────────────────────────────────────────

describe('TeacherStudentService - suspendStudent (Case 3)', () => {
  it('should suspend a student successfully', async () => {
    const repo = makeRepo({
      findStudentByEmail: jest.fn().mockResolvedValue({ id: 3 }),
      updateStudentSuspendStatus: jest.fn().mockResolvedValue(undefined),
    })
    const service = new TeacherStudentService(repo)

    await service.suspendStudent('student3@example.com')

    expect(repo.updateStudentSuspendStatus).toHaveBeenCalledWith(3)
  })

  it('should throw 404 when student is not found', async () => {
    const repo = makeRepo({ findStudentByEmail: jest.fn().mockResolvedValue(null) })
    const service = new TeacherStudentService(repo)

    await expect(service.suspendStudent('student8@example.com')).rejects.toMatchObject({
      status: 404,
      message: 'Student student8@example.com not found',
    })
  })
})

// ─── Case 4: Retrieve For Notifications ──────────────────────────────────────

describe('TeacherStudentService - getNotificationRecipients (Case 4)', () => {
  it('should return registered non-suspended students plus mentioned non-suspended students', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findActiveRegisteredStudentsByTeacherId: jest.fn().mockResolvedValue([
        { email: 'student1@example.com' },
        { email: 'student2@example.com' },
      ]),
      findActiveStudentsByEmails: jest.fn().mockResolvedValue([
        { email: 'student3@example.com' },
      ]),
    })
    const service = new TeacherStudentService(repo)

    const result = await service.getNotificationRecipients(
      'teacher1@example.com',
      'Hello @student3@example.com'
    )

    expect(result).toEqual(
      expect.arrayContaining([
        'student1@example.com',
        'student2@example.com',
        'student3@example.com',
      ])
    )
    expect(result).toHaveLength(3)
  })

  it('should exclude suspended students (student3 suspended - not in active registered)', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findActiveRegisteredStudentsByTeacherId: jest.fn().mockResolvedValue([
        { email: 'student1@example.com' },
        { email: 'student2@example.com' },
      ]),
      findActiveStudentsByEmails: jest.fn().mockResolvedValue([]),
    })
    const service = new TeacherStudentService(repo)

    const result = await service.getNotificationRecipients(
      'teacher1@example.com',
      'Hello @student3@example.com'
    )

    expect(result).toEqual(
      expect.arrayContaining(['student1@example.com', 'student2@example.com'])
    )
    expect(result).not.toContain('student3@example.com')
  })

  it('should deduplicate recipients when a mentioned student is also registered', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findActiveRegisteredStudentsByTeacherId: jest.fn().mockResolvedValue([
        { email: 'student1@example.com' },
        { email: 'student2@example.com' },
      ]),
      findActiveStudentsByEmails: jest.fn().mockResolvedValue([
        { email: 'student1@example.com' },
      ]),
    })
    const service = new TeacherStudentService(repo)

    const result = await service.getNotificationRecipients(
      'teacher1@example.com',
      'Hello @student1@example.com'
    )

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining(['student1@example.com', 'student2@example.com'])
    )
  })

  it('should return only registered students when no mentions in notification', async () => {
    const repo = makeRepo({
      findTeacherByEmail: jest.fn().mockResolvedValue({ id: 1 }),
      findActiveRegisteredStudentsByTeacherId: jest.fn().mockResolvedValue([
        { email: 'student1@example.com' },
      ]),
      findActiveStudentsByEmails: jest.fn(),
    })
    const service = new TeacherStudentService(repo)

    const result = await service.getNotificationRecipients(
      'teacher1@example.com',
      'Hello class, exam tomorrow!'
    )

    expect(result).toEqual(['student1@example.com'])
    expect(repo.findActiveStudentsByEmails).not.toHaveBeenCalled()
  })

  it('should throw 404 when teacher is not found', async () => {
    const repo = makeRepo({ findTeacherByEmail: jest.fn().mockResolvedValue(null) })
    const service = new TeacherStudentService(repo)

    await expect(
      service.getNotificationRecipients('teacher9@example.com', 'Hello!')
    ).rejects.toMatchObject({
      status: 404,
      message: 'Teacher teacher9@example.com not found',
    })
  })
})
