import type { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt"

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" })
  }

  const decoded = verifyAccessToken(token)
  if (!decoded) {
    return res.status(401).json({ error: "Token inválido ou expirado" })
  }

  req.userId = decoded.userId
  next()
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  })
}
