import express from "express"
import { v4 as uuidv4 } from "uuid"
import { query } from "../utils/db"
import { validateRequest } from "../middleware/validation"
import { transactionSchema } from "../utils/validators"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

router.use(authMiddleware)

// GET all transactions for user with optional filters
router.get("/", async (req: AuthRequest, res) => {
  try {
    const { type, category, startDate, endDate } = req.query
    let sql = "SELECT * FROM transactions WHERE user_id = $1"
    const params: any[] = [req.userId]
    let paramIndex = 2

    if (type) {
      sql += ` AND type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    if (category) {
      sql += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (startDate) {
      sql += ` AND date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      sql += ` AND date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    sql += " ORDER BY date DESC"

    const result = await query(sql, params)
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao buscar transações" })
  }
})

// GET single transaction
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const result = await query("SELECT * FROM transactions WHERE id = $1 AND user_id = $2", [id, req.userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transação não encontrada" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao buscar transação" })
  }
})

// POST create new transaction
router.post("/", validateRequest(transactionSchema), async (req: AuthRequest, res) => {
  try {
    const { type, category, amount, description, date } = req.body
    const id = uuidv4()

    const result = await query(
      `INSERT INTO transactions (id, user_id, type, category, amount, description, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, req.userId, type, category, amount, description || null, date],
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao criar transação" })
  }
})

// PUT update transaction
router.put("/:id", validateRequest(transactionSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { type, category, amount, description, date } = req.body

    const result = await query(
      `UPDATE transactions 
       SET type = $1, category = $2, amount = $3, description = $4, date = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [type, category, amount, description || null, date, id, req.userId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transação não encontrada" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao atualizar transação" })
  }
})

// DELETE transaction
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const result = await query("DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id", [id, req.userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transação não encontrada" })
    }

    res.json({ message: "Transação deletada com sucesso" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao deletar transação" })
  }
})

export default router
