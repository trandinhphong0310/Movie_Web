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
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/home`)
        const data = await response.json()
        return data.data.items
    } catch (err) {
        console.log(err)
    }
}

// lay content phim
export const getMoviesBySlugCategory = async (slug) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/danh-sach/${slug}`)
        const data = await response.json()
        return data.data.items
    } catch (err) {
        console.log(err)
    }
}

// lay title page
export const getMoviesBySlugCategory2 = async (slug) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/danh-sach/${slug}`)
        const data = await response.json()
        return data.data
    } catch (err) {
        console.log(err)
    }
}