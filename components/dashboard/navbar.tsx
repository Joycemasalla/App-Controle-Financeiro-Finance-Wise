"use client"

import { useState, useEffect } from "react"

export default function Navbar({
  deviceId,
  onToggleSidebar,
}: {
  deviceId: string
  onToggleSidebar: () => void
}) {
  const [isOnline, setIsOnline] = useState(true)

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
          
          <span className="text-xs text-foreground-muted hidden md:block">
            ID: {deviceId.substring(0, 12)}...
          </span>
        </div>
      </div>
    </nav>
  )
}
