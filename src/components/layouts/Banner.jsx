import React, { use, useEffect, useState } from 'react'
import { getMoviesBySlugCategory, getMoviesDetail } from '../../api/movie_api'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

export default function Banner() {

    const [movie, setMovie] = useState([])
    const [trailer, setTrailer] = useState("")
    const [showTrailer, setShowTrailer] = useState(false)
    const base_url = import.meta.env.VITE_BASE_IMG_URL

    useEffect(() => {
        getMoviesBySlugCategory('phim-sap-chieu')
            .then(data => {
                if (data)
                    setMovie(data.items)
            })
    }, [])

    const handleWatchTrailer = async (slug) => {
        try {
            const detail = await getMoviesDetail(slug)
            if (detail?.item.trailer_url) {
                setTrailer(detail.item.trailer_url)
                setShowTrailer(true)
            } else {
                alert("Phim chưa có trailer")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleCloseTrailer = () => {
        setShowTrailer(false)
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false
    }

    if (!movie) {
        return (
            <div className='w-full h-[870px] flex items-center justify-center bg-gray-800'>
                <span className='text-white text-xl'>Đang tải...</span>
            </div>
        )
    }

    return (
        <div className='relative w-full h-[870px] top-0'>
            <Slider {...settings}>
                {movie.map(item => (
                    <div key={item._id} className='relative w-full h-[870px]'>
                        <div
                            className='absolute inset-0 bg-center bg-no-repeat bg-cover'
                            style={{
                                backgroundImage: `linear-gradient(to right, rgba(34,31,31,0.6) 0%, rgba(34,31,31,0.4) 100%), url(${base_url}/${item.poster_url})`
                            }}
                        />
                        <div className='absolute text-white w-[50%] top-[200px] left-[100px]'>
                            <h1 className='text-[62px] uppercase font-bold'>{item.name}</h1>
                            <h2 className='text-[24px] text-[#aaaaaa] ml-[14px] mb-[24px]'>{item.origin_name}</h2>
                            <div className='flex gap-5 mb-[30px]'>
                                <p className='mt-[10px] ml-[20px] px-4 py-2 bg-red-500'>{item.quality}</p>
                                <p className='mt-[10px] px-4 py-2 bg-[#2ca32d]'>{item.lang === "Vietsub" ? "P.Đề" : ""}</p>
                                <p className='mt-[10px] ml-[20px] py-2'>{item.time}</p>
                                <p className='mt-[10px] ml-[20px] py-2'>{item.year}</p>
                                <span className=''>
                                    <p className='mb-[30px] text-[18px] text-[#cecfd1]'>{item.content}</p>
                                </span>
                            </div>
                            <div>
                                <button onClick={() => handleWatchTrailer(item.slug)} className='px-[12px] py-[24px] hover:bg-[#e50916] text-[16px] w-[140px] leading-none ml-4 cursor-pointer transform transition duration-300 ease-in-out bg-[#141414] text-white rounded'>
                                    Xem trailer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {showTrailer && trailer && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative w-[800px] h-[450px]">
                        <button
                            onClick={handleCloseTrailer}
                            className="absolute top-4 right-4 z-50 cursor-pointer"
                        >
                            <i className="fa-solid fa-xmark text-white text-[30px]"></i>
                        </button>

                        <iframe
                            width="100%"
                            height="100%"
                            src={trailer.replace("watch?v=", "embed/")}
                            title="Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    )
}
