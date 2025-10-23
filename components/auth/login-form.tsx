"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  onLoginSuccess?: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const usersJson = localStorage.getItem("users")
      const users = usersJson ? JSON.parse(usersJson) : []

      const user = users.find((u: any) => u.email === email)

      if (!user) {
        throw new Error("Email ou senha inválidos")
      }

      if (user.password !== password) {
        throw new Error("Email ou senha inválidos")
      }

      localStorage.setItem("currentUser", email)
      localStorage.setItem("userName", user.name)

      if (onLoginSuccess) {
        onLoginSuccess()
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Finance Wise</h1>
      <p className="text-foreground-muted mb-6">Gerencie suas finanças com inteligência</p>

      {error && (
        <div className="bg-danger/10 border border-danger rounded-lg p-3 mb-4 text-danger text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 p-3 bg-primary/10 border border-primary rounded-lg text-sm text-foreground">
        <p className="font-semibold mb-2">Credenciais de Teste:</p>
        <p>
          Email: <code className="bg-background px-2 py-1 rounded">teste@financewie.com</code>
        </p>
        <p>
          Senha: <code className="bg-background px-2 py-1 rounded">senha123</code>
        </p>
      </div>
    </div>
  )
}
