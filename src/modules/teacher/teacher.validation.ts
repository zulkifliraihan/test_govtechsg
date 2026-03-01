import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
})

export const updateTeacherSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).optional(),
})
