// Sistema de storage isolado por dispositivo
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
  createdAt: string
}

export interface Reminder {
  id: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  amount?: number
  category?: string
  nextDate: string
  isActive: boolean
  createdAt: string
}

export interface Loan {
  id: string
  personName: string
  amount: number
  type: 'given' | 'received'
  status: 'pending' | 'paid'
  date: string
  description?: string
  createdAt: string
}

class DeviceStorage {
  private deviceId: string

  constructor() {
    this.deviceId = this.getOrCreateDeviceId()
  }

  private getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let deviceId = localStorage.getItem('finance_device_id')
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem('finance_device_id', deviceId)
    }
    return deviceId
  }

  private getKey(type: string): string {
    return `finance_${this.deviceId}_${type}`
  }

  // Transactions
  getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(this.getKey('transactions'))
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions()
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    transactions.push(newTransaction)
    localStorage.setItem(this.getKey('transactions'), JSON.stringify(transactions))
    return newTransaction
  }

  updateTransaction(id: string, updates: Partial<Transaction>): boolean {
    const transactions = this.getTransactions()
    const index = transactions.findIndex(t => t.id === id)
    if (index === -1) return false
    
    transactions[index] = { ...transactions[index], ...updates }
    localStorage.setItem(this.getKey('transactions'), JSON.stringify(transactions))
    return true
  }

  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions()
    const filtered = transactions.filter(t => t.id !== id)
    if (filtered.length === transactions.length) return false
    
    localStorage.setItem(this.getKey('transactions'), JSON.stringify(filtered))
    return true
  }

  // Reminders
  getReminders(): Reminder[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(this.getKey('reminders'))
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveReminder(reminder: Omit<Reminder, 'id' | 'createdAt'>): Reminder {
    const reminders = this.getReminders()
    const newReminder: Reminder = {
      ...reminder,
      id: `rm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    reminders.push(newReminder)
    localStorage.setItem(this.getKey('reminders'), JSON.stringify(reminders))
    return newReminder
  }

  updateReminder(id: string, updates: Partial<Reminder>): boolean {
    const reminders = this.getReminders()
    const index = reminders.findIndex(r => r.id === id)
    if (index === -1) return false
    
    reminders[index] = { ...reminders[index], ...updates }
    localStorage.setItem(this.getKey('reminders'), JSON.stringify(reminders))
    return true
  }

  deleteReminder(id: string): boolean {
    const reminders = this.getReminders()
    const filtered = reminders.filter(r => r.id !== id)
    if (filtered.length === reminders.length) return false
    
    localStorage.setItem(this.getKey('reminders'), JSON.stringify(filtered))
    return true
  }

  // Loans
  getLoans(): Loan[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(this.getKey('loans'))
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveLoan(loan: Omit<Loan, 'id' | 'createdAt'>): Loan {
    const loans = this.getLoans()
    const newLoan: Loan = {
      ...loan,
      id: `ln_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    loans.push(newLoan)
    localStorage.setItem(this.getKey('loans'), JSON.stringify(loans))
    return newLoan
  }

  updateLoan(id: string, updates: Partial<Loan>): boolean {
    const loans = this.getLoans()
    const index = loans.findIndex(l => l.id === id)
    if (index === -1) return false
    
    loans[index] = { ...loans[index], ...updates }
    localStorage.setItem(this.getKey('loans'), JSON.stringify(loans))
    return true
  }

  deleteLoan(id: string): boolean {
    const loans = this.getLoans()
    const filtered = loans.filter(l => l.id !== id)
    if (filtered.length === loans.length) return false
    
    localStorage.setItem(this.getKey('loans'), JSON.stringify(filtered))
    return true
  }

  getDeviceId(): string {
    return this.deviceId
  }
}

export const deviceStorage = new DeviceStorage()
