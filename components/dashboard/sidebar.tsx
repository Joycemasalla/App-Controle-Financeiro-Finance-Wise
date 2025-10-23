"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/transactions", label: "Transações", icon: "💳" },
  { href: "/dashboard/reminders", label: "Lembretes", icon: "🔔" },
  { href: "/dashboard/loans", label: "Empréstimos", icon: "💰" },
  { href: "/dashboard/quick-entry", label: "Registro Rápido", icon: "⚡" },
]

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname()

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0"
      } bg-surface border-r border-border transition-all duration-300 overflow-hidden md:w-64`}
    >
      <div className="p-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === item.href ? "bg-primary text-white" : "text-foreground hover:bg-surface-light"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
