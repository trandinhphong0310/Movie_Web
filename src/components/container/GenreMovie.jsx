import { useParams, useSearchParams } from 'react-router-dom'
import { useGetMoviesByGenreQuery } from '../../redux/services/movieApi'
import MovieGrid from '../shared/MovieGrid'
import Pagination from '../shared/Pagination'
import FilterBar from '../shared/FilterBar'
import NotFound from '../pages/NotFound'
import { isAdultSlug } from '../../utils/adultFilter'

export default function GenreMovie() {
    const { slug } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const page    = Number(searchParams.get('page'))  || 1
    const limit   = Number(searchParams.get('limit')) || 24
    const country = searchParams.get('country') || ''
    const year    = searchParams.get('year')    || ''
    const sort    = searchParams.get('sort')    || ''

    const adultBlocked = isAdultSlug(slug)
    const { data, isFetching } = useGetMoviesByGenreQuery(
        { slug, page, limit, country, year, sort },
        { skip: adultBlocked }
    )
    const movies    = data?.items || []
    const title     = data?.seoOnPage?.titleHead || ''
    const totalPage = Math.ceil((data?.params?.pagination?.totalItems || 0) / limit)

    const keep = { limit, country, year, sort }
    const handlePrev = () => setSearchParams({ ...keep, page: page - 1 })
    const handleNext = () => setSearchParams({ ...keep, page: page + 1 })
    const handleGoto = (p) => setSearchParams({ ...keep, page: p })

    if (adultBlocked) return <NotFound />

    return (
        <div className='container mx-auto px-4 pt-[80px] md:pt-[90px]'>
            <h2 className='font-semibold text-white text-[22px] sm:text-[28px] py-4'>{title}</h2>
            <FilterBar pageType='the-loai' />
            <MovieGrid movies={movies} loading={isFetching} />
            <Pagination page={page} totalPage={totalPage} onPrev={handlePrev} onNext={handleNext} onGoto={handleGoto} />
        </div>
    )
}
