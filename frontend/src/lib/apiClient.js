// In production the frontend is served by the backend (same origin),
// so API_BASE_URL should be empty. For local dev, override via .env.local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

export const TOKEN_STORAGE_KEY = "mmm_access_token"
export const REFRESH_STORAGE_KEY = "mmm_refresh_token"

export function getAccessToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAuthTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken)
}

export function clearAuthTokens() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_STORAGE_KEY)
}

/**
 * Extract a human-readable error message from a backend error payload.
 */
function extractErrorMessage(payload, status) {
  if (typeof payload === "string" && payload) return payload
  if (payload && typeof payload === "object") {
    if (payload.detail) return payload.detail
    if (payload.message) return payload.message
    if (Array.isArray(payload.errors) && payload.errors.length) {
      return payload.errors
        .map((e) => e.defaultMessage || e.message || `${e.field || "field"} invalid`)
        .slice(0, 2)
        .join("; ")
    }
  }
  return `HTTP ${status}`
}

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

/**
 * Core request function. Automatically:
 * - prefixes paths with VITE_API_BASE_URL
 * - serializes body to JSON
 * - attaches Authorization: Bearer if a token is stored (unless auth: false)
 * - parses JSON response (or returns null for 204)
 * - throws ApiError on non-2xx
 */
export async function request(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  }

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (auth) {
    const token = getAccessToken()
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`
    }
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const payload = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(payload, res.status), res.status, payload)
  }

  return payload
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
}
