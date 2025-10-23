"use client"

import { useState, useEffect } from "react"
import { deviceStorage, type Transaction } from "@/lib/device-storage"

export default function TransactionListFull() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = () => {
      let data = deviceStorage.getTransactions()
      
      if (filter !== "all") {
        data = data.filter(t => t.type === filter)
      }
      
      // Ordena por data, mais recentes primeiro
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      setTransactions(data)
      setLoading(false)
    }

    loadTransactions()
    
    const interval = setInterval(loadTransactions, 1000)
    return () => clearInterval(interval)
  }, [filter])

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      deviceStorage.deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-foreground">Todas as Transações</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === "all" ? "bg-primary text-white" : "bg-muted text-foreground"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === "income" ? "bg-success text-white" : "bg-muted text-foreground"
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === "expense" ? "bg-danger text-white" : "bg-muted text-foreground"
            }`}
          >
            Despesas
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">Tipo</th>
              <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">Categoria</th>
              <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">Descrição</th>
              <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">Valor</th>
              <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">Data</th>
              <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border hover:bg-surface-light transition">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.type === "income" ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                    }`}>
                      {tx.type === "income" ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground">{tx.category}</td>
                  <td className="py-3 px-4 text-foreground-muted">{tx.description || "-"}</td>
                  <td className={`py-3 px-4 font-semibold ${tx.type === "income" ? "text-success" : "text-danger"}`}>
                    {tx.type === "income" ? "+" : "-"} R$ {Number(tx.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-foreground-muted text-sm">
                    {new Date(tx.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-danger hover:text-danger/80 text-sm"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-foreground-muted">
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transactions.length > 0 && (
        <div className="mt-4 text-sm text-foreground-muted">
          Total de {transactions.length} transação(ões)
        </div>
      )}
    </div>
  )
}
