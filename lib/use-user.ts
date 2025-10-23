"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useUser() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    const userName = localStorage.getItem("userName")

    if (!currentUser) {
      router.push("/")
      return
    }

    setUser({ email: currentUser, name: userName || "Usuário" })
    setLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return { user, loading, logout }
}
