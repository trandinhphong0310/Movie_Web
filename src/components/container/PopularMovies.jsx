import React, { useEffect, useState } from 'react'
import { getMoviesApi } from '../../api/movie_api'

export default function PopularMovies() {

    const [movie, setMovie] = useState([])
    const base_url = import.meta.env.VITE_BASE_IMG_URL

    useEffect(() => {
        getMoviesApi()
            .then(item => {
                if (item)
                    setMovie(item)
            })
    }, [])

    return (
        <div className='container mx-auto pt-[90px] pb-[60px]'>
            <div className='flex justify-between items-center'>
                <h2 className='font-semibold text-white text-[28px] py-4 uppercase'>Phim đề cử</h2>
                <span className='right-0 py-4 hover:scale-105 transform transition duration-300 ease-in-out'>
                    <button className='text-[#cecfd1] text-[16px] mt-4 cursor-pointer'>Xem tất cả</button>
                </span>
            </div>
            <div className='grid gap-6 lg:grid-cols-4 xl:grid-cols-6'>
                {movie
                    .filter(item => (item.imdb.vote_average >= 5 || item.tmdb.vote_average >= 5))
                    .slice(0, 6)
                    .map(item => (
                        <div key={item._id} className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
                            <img
                                className='w-full aspect-[2/3] object-cover rounded-lg'
                                src={`${base_url}/${item.thumb_url}`}>
                            </img>
                            <div className='bg-[#221f1f] p-[16px] rounded-md flex flex-col h-40'>
                                <h3 className='text-white text-[20px] line-clamp-2'>{item.name}</h3>
                                <p className='text-[#cecfd1] text-[14px] mt-4'>{item.time}</p>
                                <p className='text-[#cecfd1] text-[14px] mt-4'>{item.year}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
