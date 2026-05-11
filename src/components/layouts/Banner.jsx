import { useState, useEffect } from 'react'
import { useGetMoviesBySlugCategoryQuery, useGetMoviesDetailQuery } from '../../redux/services/movieApi'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from 'react-slick'

export default function Banner() {
    const [trailer, setTrailer] = useState('')
    const [showTrailer, setShowTrailer] = useState(false)
    const [trailerSlug, setTrailerSlug] = useState(null)
    const base_url = import.meta.env.VITE_BASE_IMG_URL

    const { data: bannerData } = useGetMoviesBySlugCategoryQuery({ slug: 'phim-sap-chieu' })
    const movie = (bannerData?.items || []).slice(0, 5)

    const { data: trailerData } = useGetMoviesDetailQuery(trailerSlug, { skip: !trailerSlug })

    // Khi trailerData thay đổi, cập nhật link trailer
    useEffect(() => {
        if (trailerData?.item?.trailer_url) {
            setTrailer(trailerData.item.trailer_url)
            setShowTrailer(true)
        } else if (trailerSlug && trailerData) {
            alert('Phim chưa có trailer')
            setTrailerSlug(null)
        }
    }, [trailerData])

    const handleWatchTrailer = (slug) => {
        setTrailerSlug(slug)
    }

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
    }

    return (
        <div className='relative w-full mt-[70px] md:mt-0 h-[300px] sm:h-[420px] md:h-[700px] lg:h-[870px]'>
            <Slider {...settings}>
                {movie.map(item => (
                    <div key={item._id} className='relative w-full h-[300px] sm:h-[420px] md:h-[700px] lg:h-[870px]'>
                        {/* Background */}
                        <div
                            className='absolute inset-0 bg-center bg-no-repeat bg-cover'
                            style={{
                                backgroundImage: `linear-gradient(to right, rgba(20,18,18,0.85) 0%, rgba(20,18,18,0.4) 60%, rgba(20,18,18,0.1) 100%), url(${base_url}/${item.poster_url})`
                            }}
                        />

                        {/* Text content */}
                        <div className='absolute text-white w-[90%] sm:w-[70%] md:w-[55%] lg:w-[48%]
                            top-[90px] sm:top-[120px] md:top-[160px] lg:top-[200px]
                            left-4 sm:left-8 md:left-12 lg:left-[100px]'>

                            <h1 className='text-[26px] sm:text-[38px] md:text-[50px] lg:text-[62px] uppercase font-bold leading-tight line-clamp-2'>
                                {item.name}
                            </h1>
                            <h2 className='text-[14px] sm:text-[16px] md:text-[20px] text-[#aaaaaa] mb-3 mt-1 line-clamp-1'>
                                {item.origin_name}
                            </h2>

                            <div className='flex flex-wrap items-center gap-4 mb-4'>
                                {item.quality && (
                                    <span className='px-4 py-2 text-[13px] sm:text-[15px] bg-red-500 rounded'>{item.quality}</span>
                                )}
                                {item.lang === 'Vietsub' && (
                                    <span className='px-4 py-2 text-[13px] sm:text-[15px] bg-[#2ca32d] rounded'>P.Đề</span>
                                )}
                                {item.time && (
                                    <span className='text-[13px] sm:text-[15px] text-gray-300'>{item.time}</span>
                                )}
                                {item.year && (
                                    <span className='text-[13px] sm:text-[15px] text-gray-300'>{item.year}</span>
                                )}
                            </div>

                            <p className='hidden sm:block text-[13px] md:text-[15px] text-[#cecfd1] mb-5 line-clamp-2 md:line-clamp-3'>
                                {item.content}
                            </p>

                            <button
                                onClick={() => handleWatchTrailer(item.slug)}
                                className='px-5 py-3 text-[13px] sm:text-[15px] cursor-pointer
                                    bg-[#333] hover:bg-[#e50916] text-white rounded
                                    transform transition duration-300 ease-in-out md:px-7 md:py-3'
                            >
                                Xem trailer
                            </button>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Trailer modal */}
            {showTrailer && trailer && (
                <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4'>
                    <div className='relative w-full max-w-[900px] aspect-video'>
                        <button
                            onClick={() => setShowTrailer(false)}
                            className='absolute -top-8 right-0 z-50 cursor-pointer text-white hover:text-red-400 transition'
                        >
                            <i className='fa-solid fa-xmark text-[24px]'></i>
                        </button>
                        <iframe
                            width='100%'
                            height='100%'
                            src={trailer.replace('watch?v=', 'embed/')}
                            title='Trailer'
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
