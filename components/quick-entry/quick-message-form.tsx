"use client"

import type React from "react"

import { useState } from "react"

export default function QuickMessageForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/quick-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ phone_number: phoneNumber, message }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao enviar mensagem")
      }

      const data = await response.json()
      setSuccess(
        `Transação registrada! ${data.transaction.type === "income" ? "Receita" : "Despesa"} de R$ ${Number.parseFloat(data.transaction.amount).toFixed(2)} em ${data.transaction.category}`,
      )
      setPhoneNumber("")
      setMessage("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const examples = ["Gasto 50 reais em alimentação", "Recebi 1000 de freelance", "Paguei 200 de conta de luz"]

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-foreground mb-4">Como Funciona</h2>
        <ul className="space-y-2 text-foreground-muted text-sm">
          <li>✓ Envie uma mensagem com sua transação</li>
          <li>✓ Inclua o valor, categoria e descrição</li>
          <li>✓ A transação será registrada automaticamente</li>
          <li>✓ Receba confirmação por SMS/WhatsApp</li>
        </ul>
      </div>

      {error && <div className="bg-danger/10 border border-danger rounded-lg p-4 text-danger text-sm">{error}</div>}

      {success && (
        <div className="bg-success/10 border border-success rounded-lg p-4 text-success text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Número de Telefone</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field w-full"
            placeholder="+55 11 99999-9999"
            required
          />
          <p className="text-xs text-foreground-muted mt-1">Formato: +55 11 99999-9999</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-field w-full h-24 resize-none"
            placeholder="Ex: Gasto 50 reais em alimentação no supermercado"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Enviando..." : "Enviar Mensagem"}
        </button>
      </form>

      <div className="card">
        <h3 className="font-semibold text-foreground mb-3">Exemplos de Mensagens</h3>
        <div className="space-y-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setMessage(example)}
              className="w-full text-left p-3 bg-surface-light rounded-lg hover:bg-border transition text-foreground-muted text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
