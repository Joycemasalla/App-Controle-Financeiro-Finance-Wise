"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { deviceStorage } from "@/lib/device-storage"

export default function TransactionChart() {
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  useEffect(() => {
    const loadChartData = () => {
      const transactions = deviceStorage.getTransactions()

      // Dados de categoria (pizza)
      const categoryMap: Record<string, number> = {}
      transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount)
        })

      const pieData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: Number(value)
      }))

      // Dados semanais (linha)
      const weeklyMap: Record<string, { income: number; expense: number }> = {}
      const today = new Date()

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        weeklyMap[dateStr] = { income: 0, expense: 0 }
      }

      transactions.forEach((t) => {
        const dateStr = new Date(t.date).toISOString().split("T")[0]
        if (weeklyMap[dateStr]) {
          if (t.type === "income") {
            weeklyMap[dateStr].income += Number(t.amount)
          } else {
            weeklyMap[dateStr].expense += Number(t.amount)
          }
        }
      })

      const lineData = Object.entries(weeklyMap).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("pt-BR", { weekday: "short" }),
        receita: data.income,
        despesa: data.expense,
      }))

      setCategoryData(pieData)
      setWeeklyData(lineData)
      setLoading(false)
    }

    loadChartData()
    
    // Atualiza a cada 2 segundos
    const interval = setInterval(loadChartData, 2000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-80 bg-muted animate-pulse" />
        <div className="card h-80 bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-lg font-bold text-foreground mb-4">Distribuição de Despesas</h2>
        <div className="h-64 flex items-center justify-center">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$ ${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-foreground-muted">Nenhuma despesa registrada</p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-foreground mb-4">Evolução Semanal</h2>
        <div className="h-64">
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-foreground-muted)" />
                <YAxis stroke="var(--color-foreground-muted)" />
                <Tooltip
                  formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                />
                <Legend />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} name="Despesa" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-foreground-muted">Nenhuma transação registrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
