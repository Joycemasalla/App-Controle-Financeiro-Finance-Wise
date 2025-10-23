import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from "@vercel/postgres"
import { compare } from "bcryptjs"

if (!process.env.NEXTAUTH_SECRET) {
  console.error("[v0] NEXTAUTH_SECRET is not set!")
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[v0] Missing credentials")
          return null
        }

        try {
          const result = await sql`
            SELECT id, email, password, name FROM users WHERE email = ${credentials.email}
          `

          if (result.rows.length === 0) {
            console.error("[v0] User not found:", credentials.email)
            return null
          }

          const user = result.rows[0]
          const isValid = await compare(credentials.password, user.password)

          if (!isValid) {
            console.error("[v0] Invalid password for user:", credentials.email)
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
