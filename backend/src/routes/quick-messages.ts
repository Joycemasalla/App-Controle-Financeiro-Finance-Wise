import express from "express"
import { v4 as uuidv4 } from "uuid"
import { query } from "../utils/db"
import { validateRequest } from "../middleware/validation"
import { quickMessageSchema } from "../utils/validators"
import { authMiddleware, type AuthRequest } from "../middleware/auth"

const router = express.Router()

router.use(authMiddleware)

// Parse message to extract transaction details
const parseMessage = (message: string) => {
  const patterns = [
    /gasto|despesa|paguei\s+(\d+(?:[.,]\d{2})?)\s+(?:em|de|com)\s+(\w+)/i,
    /recebi|ganho|entrada\s+(\d+(?:[.,]\d{2})?)\s+(?:de|em)\s+(\w+)/i,
    /(\d+(?:[.,]\d{2})?)\s+(?:em|de)\s+(\w+)/i,
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(",", "."))
      const category = match[2] || "Outros"
      const type =
        message.toLowerCase().includes("recebi") || message.toLowerCase().includes("ganho") ? "income" : "expense"

      return { amount, category, type, description: message }
    }
  }

  return null
}

// POST create quick message
router.post("/", validateRequest(quickMessageSchema), async (req: AuthRequest, res) => {
  try {
    const { phone_number, message } = req.body
    const id = uuidv4()

    const parsed = parseMessage(message)

    if (!parsed) {
      return res.status(400).json({
        error:
          "Não consegui entender a mensagem. Use o formato: 'Gasto 50 em alimentação' ou 'Recebi 1000 de freelance'",
      })
    }

    const { amount, category, type, description } = parsed

    const quickMessageId = uuidv4()
    const transactionId = uuidv4()

    const transactionResult = await query(
      `INSERT INTO transactions (id, user_id, type, category, amount, description, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [transactionId, req.userId, type, category, amount, description, new Date()],
    )

    await query(
      `INSERT INTO quick_messages (id, user_id, phone_number, message, transaction_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [quickMessageId, req.userId, phone_number, message, transactionId, "processed"],
    )

    res.status(201).json({
      message: "Transação registrada com sucesso!",
      transaction: transactionResult.rows[0],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao processar mensagem" })
  }
})

// GET all quick messages for user
router.get("/", async (req: AuthRequest, res) => {
  try {
    const result = await query("SELECT * FROM quick_messages WHERE user_id = $1 ORDER BY created_at DESC", [req.userId])
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao buscar mensagens" })
  }
})

export default router
