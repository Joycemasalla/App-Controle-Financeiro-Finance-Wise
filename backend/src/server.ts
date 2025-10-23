import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth"
import transactionsRoutes from "./routes/transactions"
import remindersRoutes from "./routes/reminders"
import quickMessagesRoutes from "./routes/quick-messages"
import { errorHandler } from "./middleware/auth"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionsRoutes)
app.use("/api/reminders", remindersRoutes)
app.use("/api/quick-messages", quickMessagesRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
