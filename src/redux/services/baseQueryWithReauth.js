import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  notifyAuthChanged,
  saveAuthTokens,
} from '../../utils/authTokens'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

function getRequestUrl(args) {
  return typeof args === 'string' ? args : args?.url || ''
}

function shouldSkipRefresh(args) {
  return [
    '/users/login',
    '/users/register',
    '/users/logout',
    '/users/refresh-token',
  ].includes(getRequestUrl(args))
}

export async function baseQueryWithReauth(args, api, extraOptions) {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401 || shouldSkipRefresh(args)) return result

  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearAuthTokens()
    notifyAuthChanged()
    return result
  }

  const refreshResult = await rawBaseQuery(
    {
      url: '/users/refresh-token',
      method: 'POST',
      body: { refreshToken },
    },
    api,
    extraOptions
  )

  if (refreshResult.data) {
    saveAuthTokens(refreshResult.data)
    notifyAuthChanged()
    result = await rawBaseQuery(args, api, extraOptions)
  } else {
    clearAuthTokens()
    notifyAuthChanged()
  }

  return result
}
