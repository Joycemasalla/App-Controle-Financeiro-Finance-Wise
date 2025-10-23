import { sql } from "@vercel/postgres"
import { verify } from "jsonwebtoken"

function getAuthUserId(request: Request): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  try {
    const token = authHeader.slice(7)
    const decoded = verify(token, process.env.JWT_SECRET || "secret") as any
    return decoded.userId
  } catch {
    return null
  }
}

function parseMessage(message: string): { type: string; amount: number; category: string } | null {
  // Simple pattern matching for messages like "spent 50 on food" or "earned 100 from freelance"
  const patterns = [
    /(?:spent|expense|cost)\s+(\d+(?:\.\d{2})?)\s+(?:on|for)\s+(\w+)/i,
    /(?:earned|income|received)\s+(\d+(?:\.\d{2})?)\s+(?:from|for)\s+(\w+)/i,
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) {
      const isIncome = /earned|income|received/i.test(match[0])
      return {
        type: isIncome ? "income" : "expense",
        amount: Number.parseFloat(match[1]),
        category: match[2],
      }
    }
  }

  return null
}

export async function POST(request: Request) {
  const userId = getAuthUserId(request)
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { message } = await request.json()

    const parsed = parseMessage(message)
    if (!parsed) {
      return Response.json(
        { error: "Could not parse message. Try: 'spent 50 on food' or 'earned 100 from freelance'" },
        { status: 400 },
      )
    }

    // Store the message
    await sql`
      INSERT INTO quick_messages (user_id, message, parsed_type, parsed_amount, parsed_category, created_at)
      VALUES (${userId}, ${message}, ${parsed.type}, ${parsed.amount}, ${parsed.category}, NOW())
    `

    // Create transaction
    const result = await sql`
      INSERT INTO transactions (user_id, type, amount, category, description, date, created_at)
      VALUES (${userId}, ${parsed.type}, ${parsed.amount}, ${parsed.category}, ${message}, NOW(), NOW())
      RETURNING *
    `

    return Response.json({
      success: true,
      transaction: result.rows[0],
      parsed,
    })
  } catch (error) {
    console.error("Quick message error:", error)
    return Response.json({ error: "Failed to process message" }, { status: 500 })
  }
}
