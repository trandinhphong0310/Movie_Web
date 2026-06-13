import { useGetMoviesBySlugCategoryQuery } from '../../redux/services/movieApi'
import { Link } from 'react-router-dom'
import MovieItemCard from '../shared/MovieItemCard'
import { filterNonAdultMovies } from '../../utils/adultFilter'

export default function MovieSection({ slug }) {
    const { data } = useGetMoviesBySlugCategoryQuery({ slug })
    const movies = filterNonAdultMovies(data?.items || [])
    const title = data?.breadCrumb?.[0]?.name || ''

    return (
        <>
            <div className='header-movies'>
                <h2 className='title-category'>{title}</h2>
                <button className='text-white'>
                    <Link to={`/danh-sach/${slug}?page=1&limit=24`}>Xem toàn bộ</Link>
                </button>
            </div>
            <div className='movies-card overflow-x-auto pb-2 scrollbar-hide'>
                {movies.slice(0, 5).map(item => (
                    <MovieItemCard key={item._id} item={item} layout='section' />
                ))}
            </div>
        </>
    )
}
