import { useState, useCallback, useEffect } from 'react'
import {
  useAddHistoryMutation,
  useRemoveHistoryMutation,
  useClearHistoryMutation,
} from '../redux/services/userApi'

const KEY = 'cinehub_history'
const MAX = 20

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

// Pure functions — still usable outside React components
export function readHistory() { return read() }

export function getMovieEntry(slug) {
  return read().find(h => h.slug === slug) || null
}

// React hook — syncs localStorage with API when logged in
export function useWatchHistory() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token'))
    window.addEventListener('tokenChange', handler)
    return () => window.removeEventListener('tokenChange', handler)
  }, [])

  const [addHistoryApi] = useAddHistoryMutation()
  const [removeHistoryApi] = useRemoveHistoryMutation()
  const [clearHistoryApi] = useClearHistoryMutation()

  const saveHistory = useCallback((entry) => {
    const prev = read()
    const filtered = prev.filter(h => h.slug !== entry.slug)
    const next = [entry, ...filtered].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('history_updated'))
    if (token) {
      addHistoryApi(entry.slug).catch(() => {})
    }
  }, [token, addHistoryApi])

  const removeHistory = useCallback((slug) => {
    const next = read().filter(h => h.slug !== slug)
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('history_updated'))
    if (token) {
      removeHistoryApi(slug).catch(() => {})
    }
  }, [token, removeHistoryApi])

  const clearAll = useCallback(() => {
    localStorage.removeItem(KEY)
    window.dispatchEvent(new Event('history_updated'))
    if (token) {
      clearHistoryApi().catch(() => {})
    }
  }, [token, clearHistoryApi])

  return { saveHistory, removeHistory, clearAll }
}
