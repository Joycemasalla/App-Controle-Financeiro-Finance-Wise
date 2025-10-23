"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout"
import SummaryCards from "@/components/dashboard/summary-cards"
import TransactionChart from "@/components/dashboard/transaction-chart"
import TransactionList from "@/components/dashboard/transaction-list"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    const userName = localStorage.getItem("userName")

    if (!currentUser) {
      router.push("/")
      return
    }

    setUser({ email: currentUser, name: userName })
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Carregando...</div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo, {user?.name}!</h1>
          <p className="text-foreground-muted mt-2">Aqui está um resumo das suas finanças</p>
        </div>

        <SummaryCards />
        <TransactionChart />
        <TransactionList />
      </div>
    </DashboardLayout>
  )
}
