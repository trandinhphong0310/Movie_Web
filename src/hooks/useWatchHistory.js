const KEY = 'cinehub_history'
const MAX = 20

function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
    catch { return [] }
}

export function saveToHistory(entry) {
    const prev = read()
    const filtered = prev.filter(h => h.slug !== entry.slug)
    const next = [entry, ...filtered].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
}

export function getMovieEntry(slug) {
    return read().find(h => h.slug === slug) || null
}

export function readHistory() {
    return read()
}

export function removeFromHistory(slug) {
    const next = read().filter(h => h.slug !== slug)
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('history_updated'))
}

export function clearHistory() {
    localStorage.removeItem(KEY)
    window.dispatchEvent(new Event('history_updated'))
}
