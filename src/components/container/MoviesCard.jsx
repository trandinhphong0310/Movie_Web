import { useEffect, useState } from 'react'
import { getActorForMovies, getMoviesDetail } from '../../api/movie_api'
import { useParams } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'

export default function MoviesCard() {

    const { slug } = useParams()
    const [movies, setMovies] = useState([])
    const [category, setCategory] = useState([])
    const [actor, setActor] = useState([])
    const [country, setCountry] = useState([])
    const [episode, setEpisode] = useState([])
    const [imdb, setImdb] = useState({})
    const base_url = import.meta.env.VITE_BASE_IMG_URL
    const actor_img_url = import.meta.env.VITE_ACTOR_IMG_URL

    useEffect(() => {
        getMoviesDetail(slug)
            .then(data => {
                if (data) {
                    setMovies(data.item)
                    setCategory(data.item.category)
                    setCountry(data.item.country[0])
                    setImdb(data.item.imdb)
                    setEpisode(data.item.episodes[0].server_data)
                }
            })
    }, [slug])

    useEffect(() => {
        getActorForMovies(slug)
            .then(data => {
                if (data) {
                    setActor(data.peoples)
                }
            })
    }, [slug])

    return (
        <div className='container mx-auto pt-[100px] flex w-full'>
            <div className='bg-[rgba(25,27,36,0.3)] w-[440px] rounded-2xl'>
                <img
                    src={`${base_url}/${movies.thumb_url}`}
                    alt={movies.name}
                    className='w-[160px]'
                />
                <h1 className='text-white text-[25px] mb-4'>{movies.name}</h1>
                <h2 className='text-[#ffd875] text-[14px] mb-8'>{movies.origin_name}</h2>
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
                <div>
                    <span className='text-white text-[16px]'><strong>Giới thiệu:</strong></span>
                    <div
                        className="mt-2 text-gray-400 mb-8"
                        dangerouslySetInnerHTML={{ __html: movies.content }}
                    />
                </div>
                <div className='mb-4'>
                    <strong className='text-white'>Thời lượng: </strong>
                    <span className='text-[14px] text-gray-300'>{movies.time}</span>
                </div>
                <div className='mb-4'>
                    <strong className='text-white'>Đạo diễn: </strong>
                    <span className='text-[14px] text-gray-300'>{movies.director}</span>
                </div>
                <div className='mb-4'>
                    <strong className='text-white'>Quốc gia: </strong>
                    <span className='text-[14px] text-gray-300'>{country.name}</span>
                </div>
                <div>
                    <span className='text-white text-[18px] mb-8'><strong>Diễn viên</strong></span>
                    <ul className='flex gap-4 flex-wrap'>
                        {actor.map((item, index) => (
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
            <div className='bg-[rgba(25,27,36,0.3)] grow-1 rounded-2xl'>
                <div className='flex justify-between items-center mb-4 mt-8'>
                    <button className='w-[140px] text-[18px] rounded-2xl p-4 text-[#191b24] flex gap-2 items-center justify-center bg-gradient-to-tr from-[#FECF59] to-[#FFF1CC]'>
                        <FaPlay /> Xem ngay
                    </button>
                    <span className='w-[120px] text-[14px] text-white bg-[#3556b6] rounded-xl p-2 flex justify-center gap-2'>{imdb.vote_average} Đánh giá</span>
                </div>
                <div className='border-b border-gray-600 w-fit mt-8 mb-4'>
                    <span className='text-[16px] text-white'><strong>Tập phim</strong></span>
                </div>
                <ul className='flex flex-wrap gap-4 mb-8'>
                    {episode.map((item, index) => (
                        <li className='bg-[#282b3a] py-4 px-8 overflow-x-hidden' key={index}>
                            <a className='flex gap-2 text-[14px] text-white items-center'>
                                <strong className='text-[12px]'><FaPlay /></strong>
                                <span>Tập {item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
