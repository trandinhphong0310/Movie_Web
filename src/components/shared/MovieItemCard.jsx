import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useWatchlist } from '../../hooks/useWatchlist'

const base_url = import.meta.env.VITE_BASE_IMG_URL

const LANG_MAP = {
    'Vietsub':               { label: 'Vietsub',      cls: 'bg-[#1a5c39] text-emerald-200' },
    'Vietsub + Thuyết minh': { label: 'Vsub + TM',    cls: 'bg-[#1a3a5c] text-blue-200' },
    'Thuyết minh':           { label: 'Thuyết minh', cls: 'bg-[#1a3a5c] text-blue-200' },
    'Lồng tiếng':            { label: 'Lồng tiếng',  cls: 'bg-[#4a1a5c] text-purple-200' },
}

function LangBadge({ lang, className = '' }) {
    if (!lang) return null
    const config = LANG_MAP[lang] || { label: lang, cls: 'bg-[#5e6070] text-gray-200' }
    return <span className={`movies-card_lang ${config.cls} ${className}`}>{config.label}</span>
}

export default function MovieItemCard({ item, layout = 'grid' }) {
    if (!item) return null

    const { toggle, isIn } = useWatchlist()
    const inWatchlist = isIn(item.slug)

    const movieData = {
        slug: item.slug,
        name: item.name,
        origin_name: item.origin_name,
        thumb_url: item.thumb_url,
        year: item.year,
        quality: item.quality,
        lang: item.lang,
        episode_current: item.episode_current,
    }

    function handleHeart(e) {
        e.preventDefault()
        e.stopPropagation()
        toggle(movieData)
    }

    if (layout === 'section') {
        return (
            <div className='movies-card_item'>
                <Link to={`/phim/${item.slug}`}>
                    <div className='relative group'>
                        <img src={`${base_url}/${item.thumb_url}`} alt={item.name}
                            loading='lazy' decoding='async'
                            className='w-full rounded-lg aspect-[2/3] md:aspect-video md:object-cover' />
                        <div className="absolute bottom-[-1px] left-2 flex gap-1 max-w-[calc(100%-8px)]">
                            <LangBadge lang={item.lang} className='max-w-[60%] truncate' />
                            <span className='movies-card_episode whitespace-nowrap flex-shrink-0'>{item.episode_current}</span>
                        </div>
                        {/* Heart button */}
                        <button
                            onClick={handleHeart}
                            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-all duration-200
                                ${inWatchlist ? 'bg-pink-500/90 text-white opacity-100' : 'bg-black/50 text-white hover:bg-pink-500/80'}`}
                        >
                            {inWatchlist ? <FaHeart size={11} /> : <FaRegHeart size={11} />}
                        </button>
                    </div>
                    <h3 className='movies-card_name mt-2 text-[15px]'>{item.name}</h3>
                    <h4 className='text-[12px] text-[#aaaaaa] line-clamp-1'>{item.origin_name}</h4>
                </Link>
            </div>
        )
    }

    // default "grid" layout
    return (
        <div className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
            <Link to={`/phim/${item.slug}`}>
                <div className='relative group'>
                    <img
                        loading='lazy'
                        decoding='async'
                        className='w-full aspect-[2/3] object-cover rounded-lg'
                        src={`${base_url}/${item.thumb_url}`}
                        alt={item.name}
                    />
                    {/* Heart button */}
                    <button
                        onClick={handleHeart}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-all duration-200
                            ${inWatchlist ? 'bg-pink-500/90 text-white opacity-100' : 'bg-black/60 text-white hover:bg-pink-500/80'}`}
                    >
                        {inWatchlist ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
                    </button>
                </div>
                <div className='bg-[#221f1f] p-[16px] rounded-md flex flex-col h-60 relative'>
                    <h3 className='text-white text-[20px] line-clamp-2'>{item.name}</h3>
                    <h4 className='text-[14px] text-[#aaaaaa] mt-4 mb-2'>{item.origin_name}</h4>
                    <p className='movies-card_time'>{item.time}</p>
                    <p className='movies-card_year'>{item.year}</p>
                    <div className='movies-card-lang_episode'>
                        <LangBadge lang={item.lang} />
                        <span className='movies-card_episode'>{item.episode_current}</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}
