import MovieItemCard from './MovieItemCard'

/**
 * Reusable responsive grid of movie cards.
 * Used by GenreMovie, CountryMovie, MovieListByCategory, SearchResults, PopularMovies.
 */
export default function MovieGrid({ movies = [], filter }) {
    const displayMovies = filter ? movies.filter(filter) : movies

    if (!displayMovies.length) {
        return (
            <p className='text-gray-400 text-center py-10'>Không có phim nào.</p>
        )
    }

    return (
        <div className='grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {displayMovies.map(item => (
                <MovieItemCard key={item._id} item={item} layout='grid' />
            ))}
        </div>
    )
}
