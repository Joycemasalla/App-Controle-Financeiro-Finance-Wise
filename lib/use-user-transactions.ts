"use client"

import { useState, useEffect } from "react"

export interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

export function useUserTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return

    const key = `transactions_${currentUser}`
    const stored = localStorage.getItem(key)
    if (stored) {
      setTransactions(JSON.parse(stored))
    }
  }, [])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }

    const updated = [...transactions, newTransaction]
    setTransactions(updated)

    const key = `transactions_${currentUser}`
    localStorage.setItem(key, JSON.stringify(updated))
  }

  const deleteTransaction = (id: string) => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return

    const updated = transactions.filter((t) => t.id !== id)
    setTransactions(updated)

    const key = `transactions_${currentUser}`
    localStorage.setItem(key, JSON.stringify(updated))
  }

  return { transactions, addTransaction, deleteTransaction }
}
