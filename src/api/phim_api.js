const BASE = import.meta.env.VITE_API_KEY

async function apiFetch(url) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
    return response.json()
}

export const getMoviesGenre = async () => {
    try {
        const data = await apiFetch(`${BASE}/the-loai`)
        return data.data.items
    } catch (err) { console.error(err) }
}

export const getMoviesByGenre = async (slug, page = 1, limit = 24) => {
    try {
        const data = await apiFetch(`${BASE}/the-loai/${slug}?page=${page}&limit=${limit}`)
        return data.data
    } catch (err) { console.error(err) }
}

export const getMoviesCountry = async () => {
    try {
        const data = await apiFetch(`${BASE}/quoc-gia`)
        return data.data.items
    } catch (err) { console.error(err) }
}

export const getMoviesByCountry = async (slug, page = 1, limit = 24) => {
    try {
        const data = await apiFetch(`${BASE}/quoc-gia/${slug}?page=${page}&limit=${limit}`)
        return data.data
    } catch (err) { console.error(err) }
}

export const getMoviesApi = async () => {
    try {
        const data = await apiFetch(`${BASE}/home`)
        return data.data.items
    } catch (err) { console.error(err) }
}

export const getMoviesBySlugCategory = async (slug, page = 1, limit = 24) => {
    try {
        const data = await apiFetch(`${BASE}/danh-sach/${slug}?page=${page}&limit=${limit}`)
        return data.data
    } catch (err) { console.error(err) }
}

export const searchMoviesByKeyWords = async (keywords) => {
    try {
        const data = await apiFetch(`${BASE}/tim-kiem?keyword=${keywords}`)
        return data.data
    } catch (err) { console.error(err) }
}

export const getMoviesDetail = async (slug) => {
    try {
        const data = await apiFetch(`${BASE}/phim/${slug}`)
        return data.data
    } catch (err) { console.error(err) }
}

export const getActorForMovies = async (slug) => {
    try {
        const data = await apiFetch(`${BASE}/phim/${slug}/peoples`)
        return data.data
    } catch (err) { console.error(err) }
}
