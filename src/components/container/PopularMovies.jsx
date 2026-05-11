import { useEffect, useState } from 'react'
import { useGetHomeMoviesQuery } from '../../redux/services/movieApi'
import MovieItemCard from '../shared/MovieItemCard'
import MovieGrid from '../shared/MovieGrid'

export default function PopularMovies() {
    const { data: movies = [], isLoading, isFetching } = useGetHomeMoviesQuery()
    const [isMobile, setIsMobile] = useState(false)

    // Kiểm tra kích thước màn hình
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // filter: chỉ hiện phim có imdb hoặc tmdb >= 5, giới hạn 12 phim
    const filterFn = item => (item.imdb?.vote_average >= 5 || item.tmdb?.vote_average >= 5)
    
    const filteredMovies = movies.filter(filterFn).slice(0, 12)

    return (
        <div className='container mx-auto px-4 pt-[60px] md:pt-[90px] pb-[40px] md:pb-[60px]'>
            <div className='flex justify-between items-center'>
                <h2 className='font-semibold text-white text-[22px] sm:text-[28px] py-4 uppercase'>Phim đề cử</h2>
            </div>
            
            {isMobile ? (
                <div className='movies-card overflow-x-auto pb-2 scrollbar-hide'>
                    {filteredMovies.map(item => (
                        <MovieItemCard key={item._id} item={item} layout='section' />
                    ))}
                </div>
            ) : (
                <MovieGrid movies={movies.slice(0, 24)} filter={filterFn} />
            )}
        </div>
    )
}
