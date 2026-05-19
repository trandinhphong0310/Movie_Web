import { useParams, useSearchParams } from 'react-router-dom'
import { useGetMoviesBySlugCategoryQuery } from '../../redux/services/movieApi'
import MovieGrid from '../shared/MovieGrid'
import Pagination from '../shared/Pagination'
import FilterBar from '../shared/FilterBar'

export default function MovieListByCategory() {
    const { slug } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const page     = Number(searchParams.get('page'))  || 1
    const limit    = Number(searchParams.get('limit')) || 24
    const country  = searchParams.get('country')  || ''
    const category = searchParams.get('category') || ''
    const year     = searchParams.get('year')     || ''
    const sort     = searchParams.get('sort')     || ''

    const { data } = useGetMoviesBySlugCategoryQuery({ slug, page, limit, country, category, year, sort })
    const movies    = data?.items || []
    const title     = data?.breadCrumb?.[0]?.name || ''
    const totalPage = Math.ceil((data?.params?.pagination?.totalItems || 0) / limit)

    const keep = { limit, country, category, year, sort }
    const handlePrev = () => setSearchParams({ ...keep, page: page - 1 })
    const handleNext = () => setSearchParams({ ...keep, page: page + 1 })

    return (
        <div className='container mx-auto px-4 pt-[80px] md:pt-[90px]'>
            <h2 className='font-semibold text-white text-[22px] sm:text-[28px] py-4'>{title}</h2>
            <FilterBar pageType='danh-sach' />
            <MovieGrid movies={movies} />
            <Pagination page={page} totalPage={totalPage} onPrev={handlePrev} onNext={handleNext} />
        </div>
    )
}
