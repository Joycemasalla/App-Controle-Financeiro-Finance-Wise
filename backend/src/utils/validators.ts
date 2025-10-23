import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.number().positive("Valor deve ser maior que 0"),
  description: z.string().optional(),
  date: z.string().datetime(),
})

export const reminderSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.number().positive("Valor deve ser maior que 0"),
  due_date: z.string().datetime(),
  frequency: z.enum(["monthly", "weekly", "daily", "once"]),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export const loanSchema = z.object({
  person_name: z.string().min(1, "Nome da pessoa é obrigatório"),
  amount: z.number().positive("Valor deve ser maior que 0"),
  type: z.enum(["given", "received"]),
  date: z.string().datetime(),
  status: z.enum(["pending", "paid"]),
  description: z.string().optional(),
})

export const quickMessageSchema = z.object({
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de telefone inválido"),
  message: z.string().min(1, "Mensagem é obrigatória"),
})
