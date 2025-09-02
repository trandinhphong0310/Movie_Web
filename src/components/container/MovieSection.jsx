import React, { useEffect, useState } from 'react'
import { getMoviesBySlugCategory, getMoviesBySlugCategory2 } from '../../api/movie_api'

export default function NewMovies({ slug }) {
    const [movie, setMovie] = useState([])
    const [movie2, setMovie2] = useState([])
    const base_url = import.meta.env.VITE_BASE_IMG_URL

    useEffect(() => {
        getMoviesBySlugCategory(slug)
            .then(item => {
                if (item)
                    setMovie(item)
            })
    }, [slug])

    useEffect(() => {
        getMoviesBySlugCategory2(slug)
            .then(data => {
                if (data)
                    setMovie2(data)
            })
    }, [slug])

    return (
        <>
            <div className="header-movies">
                <h2 className="title-category">
                    {movie2.titlePage}
                </h2>
                <button className="text-white">Xem toàn bộ</button>
            </div>
            <div className='movies-card'>
                {movie
                    .slice(0, 5)
                    .map(item => (
                        <div key={item._id} className='movies-card_item'>
                            <div className='relative'>
                                <img src={`${base_url}/${item.poster_url}`} alt={item.name} />
                                <div className="absolute bottom-1 left-4">
                                    <span className='movies-card_lang'>{item.lang === "Vietsub" ? "P.Đề" : "Ko P.Đề"}</span>
                                    <span className='movies-card_episode'>{item.episode_current}</span>
                                </div>
                            </div>
                            <h3 className='movies-card_name'>{item.name}</h3>
                            <h4 className='text-[12px] text-[#aaaaaa]'>{item.origin_name}</h4>
                        </div>
                    ))}
            </div>
        </>
    )
}
