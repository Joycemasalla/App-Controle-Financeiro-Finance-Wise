import { sql } from "@vercel/postgres"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    console.log("[v0] Initializing database...")

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("[v0] Users table created")

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("[v0] Sessions table created")

    // Create transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("[v0] Transactions table created")

    // Create reminders table
    await sql`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        frequency VARCHAR(50),
        amount DECIMAL(10, 2),
        category VARCHAR(100),
        next_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("[v0] Reminders table created")

    // Create loans table
    await sql`
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        person_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type VARCHAR(50),
        status VARCHAR(50),
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("[v0] Loans table created")

    // Create quick_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS quick_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        transaction_id INTEGER REFERENCES transactions(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("[v0] Quick messages table created")

    // Create test user if it doesn't exist
    const testUserExists = await sql`
      SELECT id FROM users WHERE email = 'teste@financewie.com'
    `

    if (testUserExists.rows.length === 0) {
      const hashedPassword = await hash("senha123", 10)
      await sql`
        INSERT INTO users (email, password, name, created_at, updated_at)
        VALUES ('teste@financewie.com', ${hashedPassword}, 'Usuário Teste', NOW(), NOW())
      `
      console.log("[v0] Test user created")
    }

    return Response.json(
      {
        status: "success",
        message: "Database initialized successfully",
        testUser: {
          email: "teste@financewie.com",
          password: "senha123",
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    return Response.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
