import { compare } from "bcryptjs"
import { sql } from "@vercel/postgres"
import { sign } from "jsonwebtoken"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const result = await sql`
      SELECT id, email, password, name FROM users WHERE email = ${email}
    `

    if (result.rows.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = result.rows[0]

    // Verify password
    const isValid = await compare(password, user.password)
    if (!isValid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate tokens
    const accessToken = sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    })

    const refreshToken = sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET || "refresh-secret", {
      expiresIn: "7d",
    })

    // Store refresh token in session
    await sql`
      INSERT INTO sessions (user_id, refresh_token, expires_at)
      VALUES (${user.id}, ${refreshToken}, NOW() + INTERVAL '7 days')
    `

    return Response.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
