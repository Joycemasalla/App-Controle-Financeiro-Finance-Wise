export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  created_at: Date
  updated_at: Date
}

export interface Transaction {
  id: string
  user_id: string
  type: "income" | "expense"
  category: string
  amount: number
  description?: string
  date: Date
  created_at: Date
  updated_at: Date
}

export interface Reminder {
  id: string
  user_id: string
  title: string
  amount: number
  due_date: Date
  frequency: "monthly" | "weekly" | "daily" | "once"
  is_active: boolean
  description?: string
  created_at: Date
  updated_at: Date
}

export interface Loan {
  id: string
  user_id: string
  person_name: string
  amount: number
  type: "given" | "received"
  date: Date
  status: "pending" | "paid"
  description?: string
  created_at: Date
  updated_at: Date
}

export interface Session {
  id: string
  user_id: string
  refresh_token: string
  device_info?: string
  last_used: Date
  expires_at: Date
  created_at: Date
}

export interface QuickMessage {
  id: string
  user_id: string
  phone_number: string
  message: string
  transaction_id?: string
  status: "pending" | "processed" | "failed"
  created_at: Date
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: Omit<User, "password_hash">
}
