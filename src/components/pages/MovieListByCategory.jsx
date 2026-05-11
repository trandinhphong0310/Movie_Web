import { useEffect, useState } from 'react'
import { getMoviesBySlugCategory } from '../../api/phim_api'
import { useParams, useSearchParams } from 'react-router-dom'
import MovieGrid from '../shared/MovieGrid'
import Pagination from '../shared/Pagination'

export default function MovieListByCategory() {
    const [movies, setMovies] = useState([])
    const [title, setTitle] = useState('')
    const [totalPage, setTotalPage] = useState(0)
    const { slug } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 24

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])

    useEffect(() => {
        getMoviesBySlugCategory(slug, page, limit)
            .then(data => {
                if (data) {
                    setMovies(data.items)
                    setTitle(data.breadCrumb?.[0]?.name || '')
                    setTotalPage(Math.ceil(data.params?.pagination?.totalItems / limit))
                }
            })
    }, [slug, page, limit])

    const handlePrev = () => setSearchParams({ page: page - 1, limit })
    const handleNext = () => setSearchParams({ page: page + 1, limit })

    return (
        <div className='container mx-auto px-4 pt-[80px] md:pt-[90px]'>
            <h2 className='font-semibold text-white text-[22px] sm:text-[28px] py-4'>{title}</h2>
            <MovieGrid movies={movies} />
            <Pagination page={page} totalPage={totalPage} onPrev={handlePrev} onNext={handleNext} />
        </div>
    )
}
