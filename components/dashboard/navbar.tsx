"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Navbar({
  user,
  onLogout,
  onToggleSidebar,
}: {
  user: any
  onLogout: () => void
  onToggleSidebar: () => void
}) {
  const [isOnline, setIsOnline] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleLogout = () => {
    onLogout()
    router.push("/")
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="text-foreground hover:text-primary transition">
            ☰
          </button>
          <h1 className="text-xl font-bold text-foreground">Finance Wise</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-warning"}`} />
            <span className="text-xs text-foreground-muted">{isOnline ? "Online" : "Offline"}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground-muted">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
