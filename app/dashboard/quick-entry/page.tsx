"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/layout"
import QuickMessageForm from "@/components/quick-entry/quick-message-form"

export default function QuickEntry() {
  const [user, setUser] = useState<any>(null)

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Registro Rápido</h1>
        <p className="text-foreground-muted mb-6">Envie uma mensagem para registrar uma transação rapidamente</p>
        <QuickMessageForm />
      </div>
    </DashboardLayout>
  )
}
