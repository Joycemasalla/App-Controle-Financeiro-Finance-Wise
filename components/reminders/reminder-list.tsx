"use client"

import { useState, useEffect } from "react"
import { deviceStorage, type Reminder } from "@/lib/device-storage"

export default function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReminders = () => {
      const data = deviceStorage.getReminders()
      data.sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
      setReminders(data)
      setLoading(false)
    }

    loadReminders()
    
    const interval = setInterval(loadReminders, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleToggle = (id: string, currentStatus: boolean) => {
    deviceStorage.updateReminder(id, { isActive: !currentStatus })
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r)
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este lembrete?")) {
      deviceStorage.deleteReminder(id)
      setReminders(prev => prev.filter(r => r.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="h-48 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-foreground mb-4">Meus Lembretes</h2>

      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 border rounded-lg transition ${
                reminder.isActive
                  ? "border-border bg-background"
                  : "border-muted bg-muted opacity-60"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{reminder.title}</h3>
                    <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">
                      {reminder.frequency === "daily" ? "Diário" : reminder.frequency === "weekly" ? "Semanal" : "Mensal"}
                    </span>
                    {!reminder.isActive && (
                      <span className="px-2 py-0.5 bg-muted text-foreground-muted rounded text-xs">
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  {reminder.category && (
                    <p className="text-sm text-foreground-muted mt-1">{reminder.category}</p>
                  )}
                  
                  {reminder.description && (
                    <p className="text-sm text-foreground-muted mt-2">{reminder.description}</p>
                  )}
                  
                  <div className="flex gap-4 mt-3 text-sm">
                    {reminder.amount && (
                      <span className="text-foreground">
                        💰 R$ {Number(reminder.amount).toFixed(2)}
                      </span>
                    )}
                    <span className="text-foreground-muted">
                      📅 {new Date(reminder.nextDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToggle(reminder.id, reminder.isActive)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    {reminder.isActive ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="text-sm text-danger hover:text-danger/80"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-foreground-muted">
          Nenhum lembrete cadastrado
        </div>
      )}
    </div>
  )
}
