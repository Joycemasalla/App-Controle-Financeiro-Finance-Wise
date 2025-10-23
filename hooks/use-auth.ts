"use client"

import { useEffect, useState } from "react"
import { getTokens, setupTokenRefresh, clearTokens } from "@/lib/auth-client"

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tokens = getTokens()
    setIsAuthenticated(!!tokens)
    setLoading(false)

    // Setup token refresh
    const cleanup = setupTokenRefresh()

    return cleanup
  }, [])

  const logout = () => {
    clearTokens()
    setIsAuthenticated(false)
  }

  return { isAuthenticated, loading, logout }
}
