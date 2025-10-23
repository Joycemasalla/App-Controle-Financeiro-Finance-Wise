import express from "express"
import { v4 as uuidv4 } from "uuid"
import { query } from "../utils/db"
import { validateRequest } from "../middleware/validation"
import { reminderSchema } from "../utils/validators"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

router.use(authMiddleware)

// GET all reminders for user
router.get("/", async (req: AuthRequest, res) => {
  try {
    const result = await query("SELECT * FROM reminders WHERE user_id = $1 ORDER BY due_date ASC", [req.userId])
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao buscar lembretes" })
  }
})

// GET single reminder
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const result = await query("SELECT * FROM reminders WHERE id = $1 AND user_id = $2", [id, req.userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lembrete não encontrado" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao buscar lembrete" })
  }
})

// POST create new reminder
router.post("/", validateRequest(reminderSchema), async (req: AuthRequest, res) => {
  try {
    const { title, amount, due_date, frequency, description, is_active } = req.body
    const id = uuidv4()

    const result = await query(
      `INSERT INTO reminders (id, user_id, title, amount, due_date, frequency, description, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, req.userId, title, amount, due_date, frequency, description || null, is_active ?? true],
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao criar lembrete" })
  }
})

// PUT update reminder
router.put("/:id", validateRequest(reminderSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { title, amount, due_date, frequency, description, is_active } = req.body

    const result = await query(
      `UPDATE reminders 
       SET title = $1, amount = $2, due_date = $3, frequency = $4, description = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, amount, due_date, frequency, description || null, is_active, id, req.userId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lembrete não encontrado" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao atualizar lembrete" })
  }
})

// DELETE reminder
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const result = await query("DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id", [id, req.userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lembrete não encontrado" })
    }

    res.json({ message: "Lembrete deletado com sucesso" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao deletar lembrete" })
  }
})

export default router
