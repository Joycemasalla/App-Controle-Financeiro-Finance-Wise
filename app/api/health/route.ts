import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Testa a conexão com o banco de dados
    const result = await sql`SELECT 1`

    return Response.json(
      {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Health check error:", error)
    return Response.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
