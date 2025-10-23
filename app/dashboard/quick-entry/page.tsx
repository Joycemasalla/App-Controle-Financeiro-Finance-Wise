"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout"
import QuickMessageForm from "@/components/quick-entry/quick-message-form"

export default function QuickEntry() {
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
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Registro Rápido</h1>
        <p className="text-foreground-muted mb-6">Envie uma mensagem para registrar uma transação rapidamente</p>
        <QuickMessageForm />
      </div>
    </DashboardLayout>
  )
}
