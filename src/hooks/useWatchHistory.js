import { useState, useCallback, useEffect } from 'react'
import {
  useGetHistoryQuery,
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

// Pure functions — usable outside React components
export function readHistory() { return read() }

export function getMovieEntry(slug) {
  return read().find(h => h.slug === slug) || null
}

export function useWatchHistory() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token'))
    window.addEventListener('tokenChange', handler)
    return () => window.removeEventListener('tokenChange', handler)
  }, [])

  const { data: apiHistory, isLoading } = useGetHistoryQuery(undefined, { skip: !token })
  const [addHistoryApi] = useAddHistoryMutation()
  const [removeHistoryApi] = useRemoveHistoryMutation()
  const [clearHistoryApi] = useClearHistoryMutation()

  const [localHistory, setLocalHistory] = useState(read)
  useEffect(() => {
    const sync = () => setLocalHistory(read())
    window.addEventListener('history_updated', sync)
    return () => window.removeEventListener('history_updated', sync)
  }, [])

  // When logged in: API is primary source; when not: localStorage
  const history = token ? (apiHistory || []) : localHistory

  const saveHistory = useCallback((entry) => {
    // Always save full data to localStorage (for getMovieEntry lookups)
    const prev = read()
    const filtered = prev.filter(h => h.slug !== entry.slug)
    const next = [entry, ...filtered].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('history_updated'))

    if (token) {
      addHistoryApi({
        slug: entry.slug,
        epName: entry.epName,
        watchedAt: entry.watchedAt,
      }).catch(() => {})
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

  return { history, saveHistory, removeHistory, clearAll, isLoading: token ? isLoading : false }
}
