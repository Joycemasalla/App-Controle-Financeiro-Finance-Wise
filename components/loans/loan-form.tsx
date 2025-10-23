"use client"

import { useState } from "react"
import { deviceStorage } from "@/lib/device-storage"

export default function LoanForm() {
  const [personName, setPersonName] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"given" | "received">("given")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (!personName || !amount || !date) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Valor inválido")
      }

      deviceStorage.saveLoan({
        personName,
        amount: amountNum,
        type,
        status: "pending",
        date: new Date(date).toISOString(),
        description
      })

      setSuccess(`✅ Empréstimo de R$ ${amountNum.toFixed(2)} registrado com sucesso!`)
      
      // Limpar formulário
      setPersonName("")
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
      <h2 className="text-lg font-bold text-foreground mb-4">Novo Empréstimo</h2>

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
              onClick={() => setType("given")}
              className={`flex-1 py-2 px-4 rounded-lg border transition ${
                type === "given"
                  ? "bg-danger text-white border-danger"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              Emprestei
            </button>
            <button
              type="button"
              onClick={() => setType("received")}
              className={`flex-1 py-2 px-4 rounded-lg border transition ${
                type === "received"
                  ? "bg-success text-white border-success"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              Me Emprestaram
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nome da Pessoa *</label>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="input-field w-full"
            placeholder="Ex: João Silva"
            required
          />
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
            placeholder="Descrição opcional do empréstimo"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Registrar Empréstimo
        </button>
      </form>
    </div>
  )
}
