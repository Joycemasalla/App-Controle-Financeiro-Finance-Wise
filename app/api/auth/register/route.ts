import { hash } from "bcryptjs"
import { sql } from "@vercel/postgres"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)

    console.log("[v0] Registering user:", email)

    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.rows.length > 0) {
      console.log("[v0] User already exists:", email)
      return Response.json({ error: "Usuário já existe" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password, name, created_at, updated_at)
      VALUES (${email}, ${hashedPassword}, ${name}, NOW(), NOW())
      RETURNING id, email, name
    `

    console.log("[v0] User registered successfully:", email)

    return Response.json({ user: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Registration error:", error)

    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors[0].message }, { status: 400 })
    }

    return Response.json({ error: "Erro ao registrar. Tente novamente." }, { status: 500 })
  }
}
