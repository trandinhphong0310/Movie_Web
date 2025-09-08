import React, { useEffect, useState } from 'react'
import { getMoviesApi } from '../../api/movie_api'
import { Link } from 'react-router-dom'

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
            </div>
            <div className='grid gap-6 lg:grid-cols-4 xl:grid-cols-6'>
                {movie
                    .filter(item => (item.imdb.vote_average >= 5 || item.tmdb.vote_average >= 5))
                    .map(item => (
                        <div key={item._id} className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
                            <Link to={`/phim/${item.slug}`}>
                                <img
                                    className='w-full aspect-[2/3] object-cover rounded-lg'
                                    src={`${base_url}/${item.thumb_url}`}>
                                </img>
                                <div className='bg-[#221f1f] p-[16px] rounded-md flex flex-col h-60 relative'>
                                    <h3 className='text-white text-[20px] line-clamp-2'>{item.name}</h3>
                                    <h4 className='text-[14px] text-[#aaaaaa] mt-4 mb-2'>{item.origin_name}</h4>
                                    <p className='movies-card_time'>{item.time}</p>
                                    <p className='movies-card_year'>{item.year}</p>
                                    <div className="movies-card-lang_episode">
                                        <span className='movies-card_lang'>{item.lang === "Vietsub" ? "P.Đề" : "Ko P.Đề"}</span>
                                        <span className='movies-card_episode'>{item.episode_current}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    )
}
