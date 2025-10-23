"use client"

import type React from "react"
import { useState } from "react"
import { deviceStorage } from "@/lib/device-storage"

export default function QuickMessageForm() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const parseMessage = (msg: string) => {
    const lowerMsg = msg.toLowerCase()
    
    // Padrões de reconhecimento
    const patterns = [
      // Gastos: "gasto 50 em alimentação", "gastei 100 de mercado"
      { regex: /(?:gasto|gastei|paguei|despesa)\s+(?:r\$\s*)?(\d+(?:[.,]\d{2})?)\s+(?:em|de|com|no|na)\s+(.+)/i, type: 'expense' },
      // Receitas: "recebi 1000 de salário", "ganhei 500 freelance"
      { regex: /(?:recebi|ganhei|entrada|renda)\s+(?:r\$\s*)?(\d+(?:[.,]\d{2})?)\s+(?:de|do|da|em)\s+(.+)/i, type: 'income' },
      // Formato simples: "50 alimentação", "1000 salário"
      { regex: /(\d+(?:[.,]\d{2})?)\s+(?:em|de|para)?\s*(.+)/i, type: 'expense' }
    ]

    for (const pattern of patterns) {
      const match = msg.match(pattern.regex)
      if (match) {
        const amount = parseFloat(match[1].replace(',', '.'))
        const category = match[2].trim()
        
        return {
          amount,
          category: category.charAt(0).toUpperCase() + category.slice(1),
          type: pattern.type as 'income' | 'expense',
          description: msg
        }
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const parsed = parseMessage(message)

      if (!parsed) {
        throw new Error(
          "Não consegui entender a mensagem. Use formatos como: 'Gasto 50 em alimentação' ou 'Recebi 1000 de salário'"
        )
      }

      const transaction = deviceStorage.saveTransaction({
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        date: new Date().toISOString()
      })

setSuccess(
        `✅ Transação registrada! ${transaction.type === "income" ? "Receita" : "Despesa"} de R$ ${Number(transaction.amount).toFixed(2)} em ${transaction.category}`
      )
      setMessage("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    "Gasto 50 em alimentação",
    "Recebi 1000 de salário",
    "Paguei 200 de conta de luz",
    "Ganhei 500 freelance"
  ]

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-foreground mb-4">Como Funciona</h2>
        <ul className="space-y-2 text-foreground-muted text-sm">
          <li>✓ Digite uma mensagem descrevendo sua transação</li>
          <li>✓ Inclua o valor e a categoria</li>
          <li>✓ Use palavras como "gasto", "recebi", "paguei", etc</li>
          <li>✓ A transação será registrada automaticamente</li>
        </ul>
      </div>

      {error && <div className="bg-danger/10 border border-danger rounded-lg p-4 text-danger text-sm">{error}</div>}

      {success && (
        <div className="bg-success/10 border border-success rounded-lg p-4 text-success text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-field w-full h-24 resize-none"
            placeholder="Ex: Gasto 50 em alimentação no supermercado"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Processando..." : "Registrar Transação"}
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
