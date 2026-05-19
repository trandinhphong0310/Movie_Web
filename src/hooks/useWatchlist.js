import { useState, useCallback, useEffect } from 'react'

const KEY = 'cinehub_watchlist'
const EVENT = 'watchlist_updated'

function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
    catch { return [] }
}

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState(read)

    useEffect(() => {
        const sync = () => setWatchlist(read())
        window.addEventListener(EVENT, sync)
        return () => window.removeEventListener(EVENT, sync)
    }, [])

    const toggle = useCallback((movie) => {
        const prev = read()
        const exists = prev.find(m => m.slug === movie.slug)
        const next = exists
            ? prev.filter(m => m.slug !== movie.slug)
            : [movie, ...prev]
        localStorage.setItem(KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(EVENT))
    }, [])

    const isIn = useCallback((slug) => watchlist.some(m => m.slug === slug), [watchlist])

    return { watchlist, toggle, isIn }
}
