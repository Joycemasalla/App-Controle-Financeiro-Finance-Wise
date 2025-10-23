"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "./navbar"
import Sidebar from "./sidebar"

export default function DashboardLayout({
  deviceId,
  children,
}: {
  deviceId: string
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Navbar deviceId={deviceId} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
