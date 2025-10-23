"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "./navbar"
import Sidebar from "./sidebar"

export default function DashboardLayout({
  user,
  children,
}: {
  user: any
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
