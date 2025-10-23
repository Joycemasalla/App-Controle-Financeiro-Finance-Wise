"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface RegisterFormProps {
  onRegisterSuccess?: () => void
}

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const usersJson = localStorage.getItem("users")
      const users = usersJson ? JSON.parse(usersJson) : []

      const userExists = users.find((u: any) => u.email === email)
      if (userExists) {
        throw new Error("Este email já está registrado")
      }

      users.push({ name, email, password })
      localStorage.setItem("users", JSON.stringify(users))

      // Auto login after registration
      localStorage.setItem("currentUser", email)
      localStorage.setItem("userName", name)

      if (onRegisterSuccess) {
        onRegisterSuccess()
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
      <h1 className="text-3xl font-bold mb-2 text-foreground">Criar Conta</h1>
      <p className="text-foreground-muted mb-6">Comece a gerenciar suas finanças agora</p>

      {error && (
        <div className="bg-danger/10 border border-danger rounded-lg p-3 mb-4 text-danger text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
            placeholder="Seu nome"
            required
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field w-full"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  )
}
