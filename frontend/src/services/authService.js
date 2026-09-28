const BASE_URL = 'http://localhost:8081/api/auth'

const TOKEN_KEY = 'hp_auth_token'
const USER_KEY = 'hp_auth_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const data = localStorage.getItem(USER_KEY)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function setSession(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAuthHeaders() {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Đăng nhập không thành công')
  }

  setSession(data.token, data.user)
  return data
}

export async function register(formData) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (data.errors) {
      const firstError = Object.values(data.errors)[0]
      throw new Error(firstError || data.message || 'Đăng ký không thành công')
    }
    throw new Error(data.message || 'Đăng ký không thành công')
  }

  setSession(data.token, data.user)
  return data
}

export async function fetchCurrentUser() {
  const token = getToken()
  if (!token) return null

  try {
    const res = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    if (!res.ok) {
      clearSession()
      return null
    }
    const user = await res.json()
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  } catch (err) {
    console.error('Fetch current user error:', err)
    return getStoredUser()
  }
}

export async function logout() {
  try {
    const token = getToken()
    if (token) {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      }).catch(() => {})
    }
  } finally {
    clearSession()
  }
}

export function isAdmin(user) {
  const u = user || getStoredUser()
  return u?.role === 'ROLE_ADMIN'
}

export function isMentor(user) {
  const u = user || getStoredUser()
  return u?.role === 'ROLE_MENTOR'
}
