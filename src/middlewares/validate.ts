import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const message = result.error.issues.map(issue => issue.message).join(', ')
    res.status(422).json({ message })
    return
  }
  req.body = result.data
  next()
}

export const validateQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.query)
  if (!result.success) {
    const message = result.error.issues.map(issue => issue.message).join(', ')
    res.status(400).json({ message })
    return
  }
  next()
}
