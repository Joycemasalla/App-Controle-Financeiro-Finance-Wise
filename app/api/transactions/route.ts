import { sql } from "@vercel/postgres"
import { verify } from "jsonwebtoken"
import { z } from "zod"

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  category: z.string(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
})

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

export async function GET(request: Request) {
  const userId = getAuthUserId(request)
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")

    let query = "SELECT * FROM transactions WHERE user_id = $1"
    const params: any[] = [userId]

    if (type) {
      query += ` AND type = $${params.length + 1}`
      params.push(type)
    }

    if (category) {
      query += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    query += " ORDER BY date DESC LIMIT 50"

    const result = await sql.query(query, params)
    return Response.json({ transactions: result.rows })
  } catch (error) {
    console.error("Fetch transactions error:", error)
    return Response.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = getAuthUserId(request)
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, amount, category, description, date } = transactionSchema.parse(body)

    const result = await sql`
      INSERT INTO transactions (user_id, type, amount, category, description, date, created_at)
      VALUES (${userId}, ${type}, ${amount}, ${category}, ${description || null}, ${date || new Date().toISOString()}, NOW())
      RETURNING *
    `

    return Response.json({ transaction: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Create transaction error:", error)
    return Response.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
