import { useEffect, useState } from 'react'
import { getMoviesApi } from '../../api/phim_api'
import MovieGrid from '../shared/MovieGrid'

export default function PopularMovies() {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        getMoviesApi().then(items => {
            if (items) setMovies(items)
        })
    }, [])

    // filter: chỉ hiện phim có imdb hoặc tmdb >= 5
    const filter = item => (item.imdb?.vote_average >= 5 || item.tmdb?.vote_average >= 5)

    return (
        <div className='container mx-auto px-4 pt-[60px] md:pt-[90px] pb-[40px] md:pb-[60px]'>
            <div className='flex justify-between items-center'>
                <h2 className='font-semibold text-white text-[22px] sm:text-[28px] py-4 uppercase'>Phim đề cử</h2>
            </div>
            <MovieGrid movies={movies} filter={filter} />
        </div>
    )
}
