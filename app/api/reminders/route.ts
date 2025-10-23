import { sql } from "@vercel/postgres"
import { verify } from "jsonwebtoken"
import { z } from "zod"

const reminderSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  amount: z.number().optional(),
  category: z.string().optional(),
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
    const result = await sql`
      SELECT * FROM reminders WHERE user_id = ${userId} ORDER BY created_at DESC
    `
    return Response.json({ reminders: result.rows })
  } catch (error) {
    console.error("Fetch reminders error:", error)
    return Response.json({ error: "Failed to fetch reminders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = getAuthUserId(request)
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, frequency, amount, category } = reminderSchema.parse(body)

    const result = await sql`
      INSERT INTO reminders (user_id, title, description, frequency, amount, category, created_at)
      VALUES (${userId}, ${title}, ${description || null}, ${frequency}, ${amount || null}, ${category || null}, NOW())
      RETURNING *
    `

    return Response.json({ reminder: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Create reminder error:", error)
    return Response.json({ error: "Failed to create reminder" }, { status: 500 })
  }
}
