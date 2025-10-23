"use client"

import { useState } from "react"
import { deviceStorage } from "@/lib/device-storage"

export default function TransactionForm() {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const categories = {
    income: ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"],
    expense: ["Alimentação", "Transporte", "Moradia", "Saúde", "Lazer", "Educação", "Outros"]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (!category || !amount || !date) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Valor inválido")
      }

      const transaction = deviceStorage.saveTransaction({
        type,
        category,
        amount: amountNum,
        description,
        date: new Date(date).toISOString()
      })

      setSuccess(`✅ Transação de R$ ${amountNum.toFixed(2)} registrada com sucesso!`)
      
      // Limpar formulário
      setCategory("")
      setAmount("")
      setDescription("")
      setDate(new Date().toISOString().split("T")[0])
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-foreground mb-4">Nova Transação</h2>

      {error && (
        <div className="bg-danger/10 border border-danger rounded-lg p-3 mb-4 text-danger text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success rounded-lg p-3 mb-4 text-success text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 px-4 rounded-lg border transition ${
                type === "expense"
                  ? "bg-danger text-white border-danger"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 px-4 rounded-lg border transition ${
                type === "income"
                  ? "bg-success text-white border-success"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              Receita
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categoria *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-full"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Valor (R$) *</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field w-full"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Data *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field w-full h-20 resize-none"
            placeholder="Descrição opcional da transação"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Adicionar Transação
        </button>
      </form>
    </div>
  )
}
