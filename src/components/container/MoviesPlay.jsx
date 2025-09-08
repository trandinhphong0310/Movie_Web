import React, { useEffect, useState } from 'react'
import { getActorForMovies, getMoviesDetail } from '../../api/movie_api'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'

export default function MoviesPlay() {

    const [episodes, setEpisodes] = useState([])
    const [movies, setMovies] = useState([])
    const [category, setCategory] = useState([])
    const [actor, setActor] = useState([])
    const [currentEpisode, setCurrentEpisode] = useState(null)
    const { slug } = useParams()
    const [searchParams] = useSearchParams()
    const base_url = import.meta.env.VITE_BASE_IMG_URL
    const actor_img_url = import.meta.env.VITE_ACTOR_IMG_URL

    useEffect(() => {
        getMoviesDetail(slug)
            .then(data => {
                if (data) {
                    const eps = data.item.episodes[0].server_data
                    setEpisodes(eps)

                    const epParam = searchParams.get('ep')
                    const found = eps.find(e => e.name === epParam)
                    setCurrentEpisode(found || eps[0])
                    setMovies(data.item)
                    setCategory(data.item.category)
                }
            })
    }, [slug, searchParams])

    useEffect(() => {
        getActorForMovies(slug)
            .then(data => {
                if (data) {
                    setActor(data.peoples)
                }
            })
    }, [slug])

    if (!currentEpisode) {
        return (
            <div className="text-white text-center py-10">
                Đang tải tập phim...
            </div>
        )
    }

    return (
        <div className='container mx-auto pt-[100px]'>
            <div>
                <button className='text-white text-[19px] mb-4 mt-8 hover: transform hover:scale-105 transition duration-300'>
                    <Link to={`/phim/${slug}`}>
                        Xem phim {movies.name}
                    </Link>
                </button>
            </div>
            <div className="mb-6">
                <iframe
                    src={currentEpisode.link_embed}
                    frameBorder="0"
                    allowFullScreen
                    width="100%"
                    height="800px"
                    title={`Episode ${currentEpisode.name}`}
                ></iframe>
            </div>
            <div className='bg-[rgba(25,27,36,0.3)] rounded-2xl'>
                <div className='flex flex-row p-8 items-start'>
                    <div className='flex-1 min-w-0 flex flex-col'>
                        <img
                            src={`${base_url}/${movies.thumb_url}`}
                            alt={movies.name}
                            className='w-[200px]'
                        />
                        <h1 className='text-white text-[25px] mb-4 mt-4'>{movies.name}</h1>
                        <h2 className='text-[#ffd875] text-[14px] mb-8'>{movies.origin_name}</h2>
                    </div>
                    <div className='flex-3 min-w-0 flex flex-col ml-8'>
                        <div className='flex-2 min-w-0 left-0'>
                            <ul className='flex gap-2 text-[14px] text-gray-300 mb-4'>
                                <li className='border border-white px-2 py-1 rounded bg-[#ffffff10]'>
                                    <p>{movies.year}</p>
                                </li>
                                <li className='border border-white px-2 py-1 rounded bg-[#ffffff10]'>
                                    <p>{movies.episode_total}</p>
                                </li>
                            </ul>
                            <ul className='flex flex-wrap gap-2 text-[14px] text-gray-300 mb-8'>
                                {category.map(item => (
                                    <li
                                        key={item.id}
                                        className='border border-transparent px-2 py-2 rounded bg-[#ffffff10] mb-2'
                                    >
                                        <a>{item.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='flex-3 min-w-0'>
                            <span className='text-white text-[16px]'><strong>Giới thiệu:</strong></span>
                            <div
                                className="mt-2 text-gray-400 mb-8"
                                dangerouslySetInnerHTML={{ __html: movies.content }}
                            />
                        </div>
                    </div>
                    <div className='flex-2 min-w-0 px-8 flex flex-col'>
                        <span className='text-white text-[18px] mb-8'><strong>Diễn viên</strong></span>
                        <ul className='flex gap-4 flex-wrap'>
                            {actor
                                .slice(0, 6)
                                .map((item, index) => (
                                    <li key={index}>
                                        {item.profile_path !== "" && (
                                            <a className='relative flex flex-col items-center w-[70px] h-[100px] mb-6'>
                                                <img
                                                    src={`${actor_img_url}/${item?.profile_path}`}
                                                    alt={item.name}
                                                    className='w-full h-full object-cover rounded-lg mb-2'
                                                />
                                                <span className='text-white'>{item.name}</span>
                                            </a>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
                <div className='border-b border-gray-600 w-fit mt-8 mb-4 ml-12'>
                    <span className='text-[16px] text-white'><strong>Tập phim</strong></span>
                </div>
                <div className='p-8'>
                    <ul className='flex flex-wrap gap-4 mb-8'>
                        {episodes
                            .map((item, index) => (
                                <li className='bg-[#282b3a] py-4 px-8 overflow-x-hidden' key={index}>
                                    <Link to={`/xem-phim/${slug}?ep=${item.name}`}>
                                        <a className='flex gap-2 text-[14px] text-white items-center hover:text-amber-300'>
                                            <strong className='text-[12px]'><FaPlay /></strong>
                                            <span>Tập {item.name}</span>
                                        </a>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
