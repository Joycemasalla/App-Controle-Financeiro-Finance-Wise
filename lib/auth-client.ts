// Client-side authentication utilities for multi-device support

const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000 // 50 minutes (refresh before 1h expiry)

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export const getTokens = (): AuthTokens | null => {
  if (typeof window === "undefined") return null

  const access_token = localStorage.getItem("access_token")
  const refresh_token = localStorage.getItem("refresh_token")

  if (!access_token || !refresh_token) return null

  return { access_token, refresh_token }
}

export const setTokens = (tokens: AuthTokens) => {
  if (typeof window === "undefined") return

  localStorage.setItem("access_token", tokens.access_token)
  localStorage.setItem("refresh_token", tokens.refresh_token)

  // Broadcast to other tabs
  window.localStorage.setItem("auth_updated", new Date().toISOString())
}

export const clearTokens = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
}

export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const tokens = getTokens()
    if (!tokens) return false

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    })

    if (!response.ok) {
      clearTokens()
      return false
    }

    const data = await response.json()
    setTokens(data)
    return true
  } catch (error) {
    console.error("Token refresh failed:", error)
    return false
  }
}

export const setupTokenRefresh = () => {
  if (typeof window === "undefined") return

  // Refresh token periodically
  const interval = setInterval(async () => {
    const tokens = getTokens()
    if (tokens) {
      await refreshAccessToken()
    }
  }, TOKEN_REFRESH_INTERVAL)

  // Listen for storage changes from other tabs
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "auth_updated") {
      // Token was updated in another tab, no action needed
      console.log("Auth updated in another tab")
    }
  }

  window.addEventListener("storage", handleStorageChange)

  return () => {
    clearInterval(interval)
    window.removeEventListener("storage", handleStorageChange)
  }
}

export const getAuthHeader = (): { Authorization: string } | {} => {
  const tokens = getTokens()
  if (!tokens) return {}

  return { Authorization: `Bearer ${tokens.access_token}` }
}
