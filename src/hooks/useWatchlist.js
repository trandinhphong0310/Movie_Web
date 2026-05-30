import { useState, useCallback, useEffect } from 'react'
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from '../redux/services/userApi'

const LOCAL_KEY = 'cinehub_watchlist'
const META_KEY = 'cinehub_fav_meta'
const EVENT = 'watchlist_updated'

function readLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') }
  catch { return [] }
}

function readMeta() {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}') }
  catch { return {} }
}

function saveMeta(movie) {
  const meta = readMeta()
  meta[movie.slug] = {
    name: movie.name,
    origin_name: movie.origin_name,
    thumb_url: movie.thumb_url,
    year: movie.year,
    quality: movie.quality,
    lang: movie.lang,
    episode_current: movie.episode_current,
  }
  localStorage.setItem(META_KEY, JSON.stringify(meta))
}

export function useWatchlist() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token'))
    window.addEventListener('tokenChange', handler)
    return () => window.removeEventListener('tokenChange', handler)
  }, [])

  const { data: apiData, isLoading: apiLoading } = useGetFavoritesQuery(undefined, { skip: !token })
  const [addFavMutation] = useAddFavoriteMutation()
  const [removeFavMutation] = useRemoveFavoriteMutation()

  const [localList, setLocalList] = useState(readLocal)
  useEffect(() => {
    const sync = () => setLocalList(readLocal())
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])

  // Build watchlist: if API returns full data use it; otherwise enrich with local metadata cache
  const watchlist = token
    ? (apiData || []).map(item => {
        if (item.name && item.thumb_url) return item
        return { ...item, ...(readMeta()[item.slug] || {}) }
      })
    : localList

  const toggle = useCallback(async (movie) => {
    if (token) {
      const inList = (apiData || []).some(m => m.slug === movie.slug)
      try {
        if (inList) {
          await removeFavMutation(movie.slug).unwrap()
        } else {
          saveMeta(movie)
          await addFavMutation(movie.slug).unwrap()
        }
      } catch {}
    } else {
      const prev = readLocal()
      const exists = prev.find(m => m.slug === movie.slug)
      const next = exists
        ? prev.filter(m => m.slug !== movie.slug)
        : [movie, ...prev]
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
      window.dispatchEvent(new Event(EVENT))
    }
  }, [token, apiData, addFavMutation, removeFavMutation])

  const isIn = useCallback((slug) => {
    if (token) return (apiData || []).some(m => m.slug === slug)
    return localList.some(m => m.slug === slug)
  }, [token, apiData, localList])

  return { watchlist, toggle, isIn, isLoading: token ? apiLoading : false }
}
