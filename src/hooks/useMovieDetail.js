import { useEffect, useState } from 'react'
import { getActorForMovies, getMoviesDetail } from '../api/phim_api'

/**
 * Custom hook to fetch movie detail + actors for a given slug.
 * Used by both MoviesCard and MoviesPlay to avoid duplicate API calls.
 */
export function useMovieDetail(slug) {
    const [movies, setMovies] = useState(null)
    const [category, setCategory] = useState([])
    const [country, setCountry] = useState(null)
    const [episodes, setEpisodes] = useState([])
    const [imdb, setImdb] = useState({})
    const [actor, setActor] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return
        setLoading(true)

        Promise.all([
            getMoviesDetail(slug),
            getActorForMovies(slug)
        ]).then(([detailData, actorData]) => {
            if (detailData) {
                setMovies(detailData.item)
                setCategory(detailData.item.category || [])
                setCountry(detailData.item.country?.[0] || null)
                setImdb(detailData.item.imdb || {})
                setEpisodes(detailData.item.episodes?.[0]?.server_data || [])
            }
            if (actorData) {
                setActor(actorData.peoples || [])
            }
        }).finally(() => setLoading(false))
    }, [slug])

    return { movies, category, country, episodes, imdb, actor, loading }
}
