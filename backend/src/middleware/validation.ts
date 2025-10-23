import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: any) {
      res.status(400).json({
        error: "Validação falhou",
        details: error.errors,
      })
    }
  }
}
