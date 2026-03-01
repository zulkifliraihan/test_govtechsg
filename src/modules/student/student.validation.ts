import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
})

export const updateStudentSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  is_suspended: z.boolean().optional(),
})
