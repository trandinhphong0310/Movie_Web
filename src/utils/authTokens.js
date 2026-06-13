const ACCESS_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function saveAuthTokens(payload = {}) {
  const data = payload.data || payload
  const accessToken = data.accessToken || data.token || data.access_token
  const refreshToken = data.refreshToken || data.refresh_token

  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

  return { accessToken, refreshToken }
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event('tokenChange'))
}
