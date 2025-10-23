"use client"

import { useState, useEffect } from "react"

export default function TransactionList() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const response = await fetch("/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setTransactions(
            data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
          )
        }
      } catch (error) {
        console.error("Erro ao buscar transações:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

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
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border hover:bg-surface-light transition">
                  <td className="py-3 px-4 text-foreground">{tx.category}</td>
                  <td className="py-3 px-4 text-foreground-muted">{tx.description || "-"}</td>
                  <td className={`py-3 px-4 font-semibold ${tx.type === "income" ? "text-success" : "text-danger"}`}>
                    {tx.type === "income" ? "+" : "-"} R$ {Number.parseFloat(tx.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-foreground-muted text-sm">
                    {new Date(tx.date).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-foreground-muted">
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
