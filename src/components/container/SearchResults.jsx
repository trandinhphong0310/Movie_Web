import { useSearchParams } from 'react-router-dom'
import { useSearchMoviesByKeyWordsQuery } from '../../redux/services/movieApi'
import MovieGrid from '../shared/MovieGrid'

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const keywords = searchParams.get('keyword') || ''

    const { data } = useSearchMoviesByKeyWordsQuery(keywords, { skip: !keywords.trim() })
    const movies = data?.items || []

    return (
        <div className='container mx-auto px-4 pt-[80px] md:pt-[90px]'>
            <h2 className='text-white text-[18px] sm:text-xl mb-4'>
                Kết quả tìm kiếm cho: <span className='text-yellow-300'>"{keywords}"</span>
            </h2>
            <MovieGrid movies={movies} />
        </div>
    )
}
