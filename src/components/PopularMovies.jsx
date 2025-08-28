import React, { useEffect, useState } from 'react'
import { getMoviesApi } from '../api/movie_api'

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
        <div className='pt-[90px] pb-[60px]'>
            <h2 className='font-semibold text-white text-[28px] px-64 py-4 uppercase'>Phim đề cử</h2>
            <div className='grid grid-cols-6 gap-6 px-64'>
                {movie
                    .filter(item => (item.imdb.vote_average >= 5 || item.tmdb.vote_average >= 5))
                    .map(item => (
                        <div key={item._id} className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
                            <img
                                className='w-full aspect-[2/3] object-cover rounded-lg'
                                src={`${base_url}/${item.thumb_url}`}>
                            </img>
                            <div className='bg-[#221f1f]'>
                                <h3 className='text-white text-[20px] line-clamp-2'>{item.name}</h3>
                                <p className='text-[#cecfd1] text-[14px]'>{item.time}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
