import { useEffect, useState } from 'react'
import { searchMoviesByKeyWords } from '../../api/phim_api'
import { useSearchParams } from 'react-router-dom'
import MovieGrid from '../shared/MovieGrid'

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const [movies, setMovies] = useState([])
    const keywords = searchParams.get('keyword') || ''

    useEffect(() => {
        if (!keywords.trim()) return
        searchMoviesByKeyWords(keywords)
            .then(data => {
                if (data) setMovies(data.items)
            })
    }, [keywords])

    return (
        <div className='container mx-auto px-4 pt-[80px] md:pt-[90px]'>
            <h2 className='text-white text-[18px] sm:text-xl mb-4'>
                Kết quả tìm kiếm cho: <span className='text-yellow-300'>"{keywords}"</span>
            </h2>
            <MovieGrid movies={movies} />
        </div>
    )
}
