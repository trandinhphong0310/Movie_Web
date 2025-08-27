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