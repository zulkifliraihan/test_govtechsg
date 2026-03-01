import { z } from 'zod'

export const registerSchema = z.object({
  teacher: z.string().email({ message: 'Invalid teacher email format' }),
  students: z
    .array(z.string().email({ message: 'Invalid student email format' }))
    .min(1, { message: 'At least one student is required' }),
})

export const suspendSchema = z.object({
  student: z.string().email({ message: 'Invalid student email format' }),
})

export const notificationSchema = z.object({
  teacher: z.string().email({ message: 'Invalid teacher email format' }),
  notification: z.string().min(1, { message: 'Notification text is required' }),
})

export const commonStudentsQuerySchema = z.object({
  teacher: z.union([
    z.string().email({ message: 'Invalid teacher email format' }),
    z.array(z.string().email({ message: 'Invalid teacher email format' })).min(1),
  ], { error: 'Query parameter "teacher" is required' }),
})
