"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/layout"
import TransactionForm from "@/components/transactions/transaction-form"
import TransactionListFull from "@/components/transactions/transaction-list-full"
import { deviceStorage } from "@/lib/device-storage"

export default function TransactionsPage() {
  const [deviceId, setDeviceId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = deviceStorage.getDeviceId()
    setDeviceId(id)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Carregando...</div>
      </div>
    )
  }

  return (
    <DashboardLayout deviceId={deviceId}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transações</h1>
          <p className="text-foreground-muted">Gerencie todas as suas transações</p>
        </div>

        <TransactionForm />
        <TransactionListFull />
      </div>
    </DashboardLayout>
  )
}
