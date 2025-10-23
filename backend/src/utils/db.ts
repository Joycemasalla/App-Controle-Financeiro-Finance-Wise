import { sql } from "@vercel/postgres"

export const query = async (text: string, params?: any[]) => {
  try {
    // Convert parameterized query format from $1, $2 to ? for @vercel/postgres
    let query = text
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        query = query.replace(`$${index + 1}`, "?")
      })
      return await sql.query(query, params)
    }
    return await sql.query(query)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export const getClient = async () => {
  // @vercel/postgres doesn't use connection pooling in the traditional sense
  // Each query is handled automatically, so we return a query function
  return { query }
}

export default { query, getClient }
