import express from "express"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"
import { validateRequest } from "../middleware/validation"
import { registerSchema, loginSchema } from "../utils/validators"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// Mock database - replace with real DB
const users: any[] = []
const sessions: any[] = []

router.post("/register", validateRequest(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "Email já registrado" })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const user = {
      id: uuidv4(),
      email,
      password_hash,
      name,
      created_at: new Date(),
      updated_at: new Date(),
    }

    users.push(user)

    const { access_token, refresh_token } = generateTokens(user.id)

    sessions.push({
      id: uuidv4(),
      user_id: user.id,
      refresh_token,
      device_info: req.headers["user-agent"],
      last_used: new Date(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
    })

    res.status(201).json({
      access_token,
      refresh_token,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar" })
  }
})

router.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body
    const user = users.find((u) => u.email === email)

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Email ou senha inválidos" })
    }

    const { access_token, refresh_token } = generateTokens(user.id)

    sessions.push({
      id: uuidv4(),
      user_id: user.id,
      refresh_token,
      device_info: req.headers["user-agent"],
      last_used: new Date(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
    })

    res.json({
      access_token,
      refresh_token,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" })
  }
})

router.post("/refresh", (req, res) => {
  try {
    const { refresh_token } = req.body
    const decoded = verifyRefreshToken(refresh_token)

    if (!decoded) {
      return res.status(401).json({ error: "Refresh token inválido" })
    }

    const { access_token, refresh_token: new_refresh_token } = generateTokens(decoded.userId)

    res.json({
      access_token,
      refresh_token: new_refresh_token,
    })
  } catch (error) {
    res.status(500).json({ error: "Erro ao renovar token" })
  }
})

router.post("/logout", authMiddleware, (req: AuthRequest, res) => {
  try {
    const { refresh_token } = req.body
    const index = sessions.findIndex((s) => s.refresh_token === refresh_token)

    if (index > -1) {
      sessions.splice(index, 1)
    }

    res.json({ message: "Logout realizado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer logout" })
  }
})

router.get("/me", authMiddleware, (req: AuthRequest, res) => {
  try {
    const user = users.find((u) => u.id === req.userId)
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    res.json({ id: user.id, email: user.email, name: user.name })
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" })
  }
})

export default router
