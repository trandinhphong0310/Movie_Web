import React, { useEffect, useState } from 'react'
import { getMoviesBySlug } from '../api/movie_api'
import image from '../assets/image.png'

export default function Banner() {

    const [movie, setMovie] = useState(null)

    useEffect(() => {
        getMoviesBySlug('cuoc-chien-mafia')
            .then(item => {
                if (item)
                    setMovie(item)
            })
    }, [])

    if (!movie) {
        return (
            <div className='w-full h-[870px] flex items-center justify-center bg-gray-800'>
                <span className='text-white text-xl'>Đang tải...</span>
            </div>
        )
    }

    return (
        <div>
            <div
                className='absolute -top-4.5 left-0 w-full h-[870px] 
                bg-center bg-no-repeat bg-cover'
                style={{ backgroundImage: `linear-gradient(to right, rgba(34,31,31,0.6) 0%, rgba(34,31,31,0.4) 100%), url(${image})` }}
            >
            </div>
            <div className='absolute text-white w-[50%] top-[200px] left-[100px]'>
                <h1 className='text-[62px] uppercase font-bold'>{movie.name}</h1>
                <div className='flex gap-5 mb-[30px]'>
                    <p className='mt-[10px] ml-[20px]'>{movie.quality}</p>
                    <p className='mt-[10px] ml-[20px]'>{movie.time}</p>
                    <p className='mt-[10px] ml-[20px]'>{movie.year}</p>
                </div>
                <span className=''>
                    <p className='mb-[30px] text-[18px] text-[#cecfd1]'>{movie.content}</p>
                </span>
                <div>
                    <button className='px-[12px] py-[24px] hover:bg-[#e50916] text-[16px] w-[140px] leading-none ml-4 cursor-pointer transform transition duration-300 ease-in-out bg-[#141414] text-white rounded'>
                        Xem phim
                    </button>
                    <button className='px-[12px] py-[24px] hover:bg-[#e50916] text-[16px] w-[140px] leading-none ml-4 cursor-pointer transform transition duration-300 ease-in-out bg-[#141414] text-white rounded'>
                        Xem trailer
                    </button>
                </div>
            </div>
        </div>
    )
}
