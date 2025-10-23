"use client"

import { useState, useEffect } from "react"
import { deviceStorage, type Transaction } from "@/lib/device-storage"

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = () => {
      const data = deviceStorage.getTransactions()
      // Ordena por data, mais recentes primeiro
      const sorted = data.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 10)
      setTransactions(sorted)
      setLoading(false)
    }

    loadTransactions()
    
    // Atualiza a cada segundo
    const interval = setInterval(loadTransactions, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      deviceStorage.deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-lg font-bold text-foreground mb-4">Últimas Transações</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-foreground mb-4">Últimas Transações</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
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
                <td colSpan={5} className="py-8 text-center text-foreground-muted">
                  Nenhuma transação registrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
