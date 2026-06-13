import MovieItemCard from './MovieItemCard'
import { SkeletonCard } from './SkeletonCard'
import { filterNonAdultMovies } from '../../utils/adultFilter'

const GRID_CLASS = 'grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

export default function MovieGrid({ movies = [], filter, loading = false }) {
    if (loading) {
        return (
            <div className={GRID_CLASS}>
                {Array.from({ length: 24 }).map((_, i) => (
                    <SkeletonCard key={i} layout='grid' />
                ))}
            </div>
        )
    }

    const safeMovies = filterNonAdultMovies(movies)
    const displayMovies = filter ? safeMovies.filter(filter) : safeMovies

    if (!displayMovies.length) {
        return (
            <p className='text-gray-400 text-center py-10'>Không có phim nào.</p>
        )
    }

    return (
        <div className={GRID_CLASS}>
            {displayMovies.map(item => (
                <MovieItemCard key={item._id} item={item} layout='grid' />
            ))}
        </div>
    )
}
