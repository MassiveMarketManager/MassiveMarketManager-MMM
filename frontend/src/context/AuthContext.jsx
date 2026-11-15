import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  apiClient,
  setAuthTokens,
  clearAuthTokens,
  getAccessToken,
  ApiError,
} from "@/lib/apiClient"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, try to restore session from a stored access token
  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const me = await apiClient.get("/api/users/me")
        if (!cancelled) setUser(me)
      } catch (e) {
        // Token is invalid/expired — drop it
        clearAuthTokens()
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await apiClient.post(
      "/api/auth/sign-in",
      { email, password },
      { auth: false }
    )
    setAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })

    // Prefer the richer /me payload, fall back to what sign-in returned
    try {
      const me = await apiClient.get("/api/users/me")
      setUser(me)
    } catch {
      setUser(data.user)
    }

    return data
  }, [])

  const logout = useCallback(() => {
    clearAuthTokens()
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

// Re-export for convenience
export { ApiError }
