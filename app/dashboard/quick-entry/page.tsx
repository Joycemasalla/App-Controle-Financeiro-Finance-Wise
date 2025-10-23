"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/layout"
import QuickMessageForm from "@/components/quick-entry/quick-message-form"
import { deviceStorage } from "@/lib/device-storage"

export default function QuickEntry() {
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
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Registro Rápido</h1>
        <p className="text-foreground-muted mb-6">Envie uma mensagem para registrar uma transação rapidamente</p>
        <QuickMessageForm />
      </div>
    </DashboardLayout>
  )
}
