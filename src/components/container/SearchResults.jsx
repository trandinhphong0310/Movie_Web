import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMoviesByKeyWords } from '../../api/movie_api'

export default function SearchResults() {

    const [searchParams] = useSearchParams()
    const [movies, setMovies] = useState([])
    const keywords = searchParams.get('keyword') || ''
    const base_url = import.meta.env.VITE_BASE_IMG_URL

    useEffect(() => {
        if(keywords.trim()) {
            searchMoviesByKeyWords(keywords)
            .then(data => {
                if (data)
                    setMovies(data.items)
            })
        }
    }, [keywords])


    return (
        <div className='container mx-auto pt-[90px]'>
            <h2 className="text-white text-xl mb-4">
                Kết quả tìm kiếm cho: <span className="">{keywords}</span>
            </h2>
            <div className='grid gap-6 lg:grid-cols-4 xl:grid-cols-6'>
                {movies.map(item => (
                    <div key={item._id} className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
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
                    </div>
                ))}
            </div>
        </div>
    )
}
