export const getMoviesGenre = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/the-loai`)
        const data = await response.json()
        return data.data.items
    } catch (err) {
        console.log(err)
    }
}

export const getMoviesCountry = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/quoc-gia`)
        const data = await response.json()
        return data.data.items
    } catch (err) {
        console.log(err)
    }
}

export const getMoviesApi = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/home`, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        })
        const data = await response.json()
        return data.data.items
    } catch (err) {
        console.log(err)
    }
}

export const getMoviesBySlug = async (slug) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/phim/${slug}`)
        const data = await response.json()
        return data.data.item
    } catch (err) {
        console.log(err)
    }
}

export const getMoviesBySlugCategory = async (slug) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/danh-sach/${slug}`)
        const data = await response.json()
        return data.data.items
    } catch (err) {
        console.log(err)
    }
}

export const getMoviesBySlugCategory2 = async (slug) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/danh-sach/${slug}`)
        const data = await response.json()
        return data.data
    } catch (err) {
        console.log(err)
    }
}