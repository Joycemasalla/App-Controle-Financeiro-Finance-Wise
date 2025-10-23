"use client"

import { useState } from "react"
import { deviceStorage } from "@/lib/device-storage"

export default function ReminderForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [nextDate, setNextDate] = useState(new Date().toISOString().split("T")[0])
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const categories = ["Aluguel", "Conta de Luz", "Conta de Água", "Internet", "Telefone", "Streaming", "Academia", "Outros"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (!title || !nextDate) {
        throw new Error("Preencha os campos obrigatórios")
      }

      const amountNum = amount ? parseFloat(amount) : undefined
      if (amount && (isNaN(amountNum!) || amountNum! <= 0)) {
        throw new Error("Valor inválido")
      }

      deviceStorage.saveReminder({
        title,
        description,
        frequency,
        amount: amountNum,
        category: category || undefined,
        nextDate: new Date(nextDate).toISOString(),
        isActive: true
      })

      setSuccess("✅ Lembrete criado com sucesso!")
      
      // Limpar formulário
      setTitle("")
      setDescription("")
      setAmount("")
      setCategory("")
      setNextDate(new Date().toISOString().split("T")[0])
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-foreground mb-4">Novo Lembrete</h2>

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
          <label className="block text-sm font-medium mb-2">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full"
            placeholder="Ex: Pagamento do aluguel"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-full"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Frequência *</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            className="input-field w-full"
            required
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field w-full"
            placeholder="0.00 (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Próxima Data *</label>
          <input
            type="date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
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
            placeholder="Descrição opcional"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Criar Lembrete
        </button>
      </form>
    </div>
  )
}
