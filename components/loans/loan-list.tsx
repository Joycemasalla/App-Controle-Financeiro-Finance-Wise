"use client"

import { useState, useEffect } from "react"
import { deviceStorage, type Loan } from "@/lib/device-storage"

export default function LoanList() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [filter, setFilter] = useState<"all" | "given" | "received" | "pending" | "paid">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLoans = () => {
      let data = deviceStorage.getLoans()
      
      if (filter === "given" || filter === "received") {
        data = data.filter(l => l.type === filter)
      } else if (filter === "pending" || filter === "paid") {
        data = data.filter(l => l.status === filter)
      }
      
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setLoans(data)
      setLoading(false)
    }

    loadLoans()
    
    const interval = setInterval(loadLoans, 2000)
    return () => clearInterval(interval)
  }, [filter])

  const handleToggleStatus = (id: string, currentStatus: "pending" | "paid") => {
    const newStatus = currentStatus === "pending" ? "paid" : "pending"
    deviceStorage.updateLoan(id, { status: newStatus })
    setLoans(prev =>
      prev.map(l => l.id === id ? { ...l, status: newStatus } : l)
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este empréstimo?")) {
      deviceStorage.deleteLoan(id)
      setLoans(prev => prev.filter(l => l.id !== id))
    }
  }

  const getTotalByType = (type: "given" | "received", status?: "pending" | "paid") => {
    return loans
      .filter(l => l.type === type && (!status || l.status === status))
      .reduce((sum, l) => sum + Number(l.amount), 0)
  }

  if (loading) {
    return (
      <div className="card">
        <div className="h-48 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-foreground-muted mb-2">Emprestei (Pendente)</h3>
          <p className="text-2xl font-bold text-danger">
            R$ {getTotalByType("given", "pending").toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-foreground-muted mb-2">Me Emprestaram (Pendente)</h3>
          <p className="text-2xl font-bold text-success">
            R$ {getTotalByType("received", "pending").toFixed(2)}
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">Empréstimos</h2>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === "all" ? "bg-primary text-white" : "bg-muted text-foreground"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("given")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === "given" ? "bg-danger text-white" : "bg-muted text-foreground"
              }`}
            >
              Emprestei
            </button>
            <button
              onClick={() => setFilter("received")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === "received" ? "bg-success text-white" : "bg-muted text-foreground"
              }`}
            >
              Me Emprestaram
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === "pending" ? "bg-warning text-white" : "bg-muted text-foreground"
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === "paid" ? "bg-primary text-white" : "bg-muted text-foreground"
              }`}
            >
              Pagos
            </button>
          </div>
        </div>

        {loans.length > 0 ? (
          <div className="space-y-3">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="p-4 border border-border rounded-lg hover:bg-surface-light transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{loan.personName}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        loan.type === "given"
                          ? "bg-danger/20 text-danger"
                          : "bg-success/20 text-success"
                      }`}>
                        {loan.type === "given" ? "Emprestei" : "Me Emprestaram"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        loan.status === "pending"
                          ? "bg-warning/20 text-warning"
                          : "bg-primary/20 text-primary"
                      }`}>
                        {loan.status === "pending" ? "Pendente" : "Pago"}
                      </span>
                    </div>

                    {loan.description && (
                      <p className="text-sm text-foreground-muted mb-2">{loan.description}</p>
                    )}

                    <div className="flex gap-4 text-sm">
                      <span className={`font-semibold ${
                        loan.type === "given" ? "text-danger" : "text-success"
                      }`}>
                        R$ {Number(loan.amount).toFixed(2)}
                      </span>
                      <span className="text-foreground-muted">
                        📅 {new Date(loan.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleStatus(loan.id, loan.status)}
                      className={`text-sm ${
                        loan.status === "pending"
                          ? "text-primary hover:text-primary/80"
                          : "text-warning hover:text-warning/80"
                      }`}
                    >
                      {loan.status === "pending" ? "Marcar Pago" : "Marcar Pendente"}
                    </button>
                    <button
                      onClick={() => handleDelete(loan.id)}
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
            Nenhum empréstimo encontrado
          </div>
        )}

        {loans.length > 0 && (
          <div className="mt-4 text-sm text-foreground-muted">
            Total de {loans.length} empréstimo(s)
          </div>
        )}
      </div>
    </div>
  )
}
```

## Passo 7: Remover Arquivos de Autenticação

Delete estes arquivos:
```
❌ components/auth/login-form.tsx
❌ components/auth/register-form.tsx
❌ lib/use-user.ts
❌ lib/use-user-transactions.ts
