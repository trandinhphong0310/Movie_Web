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
    const tmdb = detailData?.item?.tmdb || {}
    const servers = detailData?.item?.episodes || []          // Tất cả các server
    const episodes = servers[0]?.server_data || []            // Server đầu tiên mặc định
    const actor = detailData?.item?.actor || []               // Diễn viên từ item
    const director = detailData?.item?.director || []         // Đạo diễn
    const peoples = actorData?.peoples || []                  // Avatar actors
    const loading = loadingDetail || loadingActor

    return { movies, category, country, episodes, servers, imdb, tmdb, actor, director, peoples, loading }
}
