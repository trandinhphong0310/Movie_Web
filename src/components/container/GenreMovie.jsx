import React, { useEffect, useState } from 'react'
import { getMoviesByGenre } from '../../api/movie_api'
import { useParams } from 'react-router-dom'

export default function GenreMovie() {

    const [movies, setMovies] = useState([])
    const [title, setTitle] = useState('')
    const { slug } = useParams()
    const base_url = import.meta.env.VITE_BASE_IMG_URL

    useEffect(() => {
        getMoviesByGenre(slug)
            .then(data => {
                if (data) {
                    setMovies(data.items)
                    setTitle(data.seoOnPage?.titleHead || '')
                }
            })
    }, [slug])

    return (
        <div className='container mx-auto pt-[90px]'>
            <div>
                <h2 className='font-semibold text-white text-[28px] py-4'>{title}</h2>
            </div>
            <div className='grid gap-6 lg:grid-cols-4 xl:grid-cols-6'>
                {movies
                    .map(item => (
                        <div key={item._id} className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
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
                        </div>
                    ))}
            </div>
        </div>
    )
}
