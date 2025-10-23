"use client"

import { useState, useEffect } from "react"

export default function SummaryCards() {
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    transactions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return

    const key = `transactions_${currentUser}`
    const stored = localStorage.getItem(key)
    const transactions = stored ? JSON.parse(stored) : []

    const income = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + Number.parseFloat(t.amount), 0)

    const expenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + Number.parseFloat(t.amount), 0)

    setStats({
      income,
      expenses,
      balance: income - expenses,
      transactions: transactions.length,
    })

    setLoading(false)
  }, [])

  const cards = [
    {
      label: "Receitas (Mês)",
      value: `R$ ${stats.income.toFixed(2)}`,
      color: "success",
      icon: "📈",
    },
    {
      label: "Despesas (Mês)",
      value: `R$ ${stats.expenses.toFixed(2)}`,
      color: "danger",
      icon: "📉",
    },
    {
      label: "Saldo",
      value: `R$ ${stats.balance.toFixed(2)}`,
      color: "primary",
      icon: "💵",
    },
    {
      label: "Transações",
      value: stats.transactions,
      color: "warning",
      icon: "📊",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card h-24 bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground-muted text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-foreground mt-2">{card.value}</p>
            </div>
            <span className="text-4xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
