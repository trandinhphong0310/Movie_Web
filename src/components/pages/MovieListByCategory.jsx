import { useEffect, useState } from 'react'
import { getMoviesBySlugCategory } from '../../api/movie_api'
import { Link, useParams, useSearchParams } from 'react-router-dom'

export default function MovieListByCategory() {
    const [movies, setMovies] = useState([])
    const [title, setTitle] = useState('')
    const [totalPage, setTotalPage] = useState(0)
    const { slug } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const base_url = import.meta.env.VITE_BASE_IMG_URL

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

    const handleNext = () => {
        setSearchParams({ page: page + 1, limit })
    }

    const handlePrev = () => {
        setSearchParams({ page: page - 1, limit })
    }

    return (
        <div className='container mx-auto pt-[90px]'>
            <div>
                <h2 className='font-semibold text-white text-[28px] py-4'>{title}</h2>
            </div>
            <div className='grid gap-6 lg:grid-cols-4 xl:grid-cols-6'>
                {movies.map(item => (
                    <div key={item._id} className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
                        <Link to={`/phim/${item.slug}`}>
                            <img
                                className='w-full aspect-[2/3] object-cover rounded-lg'
                                src={`${base_url}/${item.thumb_url}`}
                                alt={item.name}
                            />
                            <div className='bg-[#221f1f] p-[16px] rounded-md flex flex-col h-60 relative'>
                                <h3 className='text-white text-[20px] line-clamp-2'>{item.name}</h3>
                                <h4 className='text-[14px] text-[#aaaaaa] mt-4 mb-2'>{item.origin_name}</h4>
                                <p className='movies-card_time'>{item.time}</p>
                                <p className='movies-card_year'>{item.year}</p>
                                <div className="movies-card-lang_episode">
                                    <span className='movies-card_lang'>
                                        {item.lang === "Vietsub" ? "P.Đề" : "Ko P.Đề"}
                                    </span>
                                    <span className='movies-card_episode'>{item.episode_current}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="text-white flex justify-center gap-4 pt-20">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className='bg-[#2f3346] size-[50px] rounded-3xl cursor-pointer'
                >
                    <i className='fa-solid fa-arrow-left'></i>
                </button>
                <span className='bg-[#2f3346] w-[160px] h-[50px] rounded-xl flex items-center justify-center'>
                    Trang {page} / {totalPage}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page >= totalPage}
                    className='bg-[#2f3346] size-[50px] rounded-3xl cursor-pointer'
                >
                    <i className='fa-solid fa-arrow-right'></i>
                </button>
            </div>
        </div>
    )
}
