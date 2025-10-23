"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(user)
      // Redirect to dashboard
      window.location.href = "/dashboard"
    }
  }, [])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <>
            <LoginForm onLoginSuccess={() => (window.location.href = "/dashboard")} />
            <p className="text-center mt-6 text-foreground-muted">
              Não tem conta?{" "}
              <button onClick={() => setIsLogin(false)} className="text-primary hover:underline font-semibold">
                Registre-se
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm onRegisterSuccess={() => setIsLogin(true)} />
            <p className="text-center mt-6 text-foreground-muted">
              Já tem conta?{" "}
              <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-semibold">
                Faça login
              </button>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
