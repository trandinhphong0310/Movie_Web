import { useGetMoviesDetailQuery, useGetActorForMoviesQuery } from '../redux/services/movieApi'

/**
 * Custom hook to fetch movie detail + actors for a given slug.
 * Used by both MoviesCard and MoviesPlay to avoid duplicate API calls.
 */
export function useMovieDetail(slug) {
    const { data: detailData, isLoading: loadingDetail } = useGetMoviesDetailQuery(slug, { skip: !slug })
    const { data: actorData, isLoading: loadingActor } = useGetActorForMoviesQuery(slug, { skip: !slug })

    const movies = detailData?.item || null
    const category = detailData?.item?.category || []
    const country = detailData?.item?.country?.[0] || null
    const imdb = detailData?.item?.imdb || {}
    const episodes = detailData?.item?.episodes?.[0]?.server_data || []
    const actor = actorData?.peoples || []
    const loading = loadingDetail || loadingActor

    return { movies, category, country, episodes, imdb, actor, loading }
}
