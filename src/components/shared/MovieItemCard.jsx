import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa'
import { useWatchlist } from '../../hooks/useWatchlist'
import { useGetMoviesDetailQuery } from '../../redux/services/movieApi'

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

function getYouTubeId(url) {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match?.[1] || null
}

const POPUP_WIDTH = 280

function HoverPreview({ item, visible, anchorRef, popupHoveredRef, onClose }) {
    const navigate = useNavigate()
    const { data } = useGetMoviesDetailQuery(item.slug, { skip: !visible })
    const videoId = getYouTubeId(data?.item?.trailer_url)
    const [style, setStyle] = useState(null)

    useLayoutEffect(() => {
        if (!visible || !anchorRef.current) { setStyle(null); return }
        const rect = anchorRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const showAbove = spaceBelow < 260

        let left = rect.left + rect.width / 2 - POPUP_WIDTH / 2
        left = Math.max(8, Math.min(left, window.innerWidth - POPUP_WIDTH - 8))

        setStyle({
            position: 'fixed',
            width: POPUP_WIDTH,
            left,
            ...(showAbove
                ? { bottom: window.innerHeight - rect.top + 6 }
                : { top: rect.bottom + 6 }),
            zIndex: 9999,
        })
    }, [visible, anchorRef])

    if (!visible || !style) return null

    return createPortal(
        <div
            style={style}
            className='bg-[#141824] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fadeIn'
            onMouseEnter={() => { popupHoveredRef.current = true }}
            onMouseLeave={() => { popupHoveredRef.current = false; onClose() }}
        >
            {/* Video hoặc poster */}
            <div className='aspect-video bg-black relative'>
                {videoId ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0`}
                        className='w-full h-full'
                        allow='autoplay; encrypted-media'
                        title={item.name}
                    />
                ) : (
                    <>
                        <img
                            src={`${base_url}/${item.thumb_url}`}
                            alt={item.name}
                            className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                            <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                                <FaPlay className='text-white text-[14px] ml-0.5' />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Info */}
            <div className='p-3'>
                <p className='text-white font-semibold text-[13px] line-clamp-1 mb-2'>{item.name}</p>
                <div className='flex items-center gap-1 flex-wrap mb-2.5'>
                    {item.year && (
                        <span className='text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300'>
                            {item.year}
                        </span>
                    )}
                    {item.quality && (
                        <span className='text-[11px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20'>
                            {item.quality}
                        </span>
                    )}
                    {item.episode_current && (
                        <span className='text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300'>
                            {item.episode_current}
                        </span>
                    )}
                    {item.lang && (
                        <span className='text-[11px] px-1.5 py-0.5 rounded bg-emerald-800/50 text-emerald-300'>
                            {item.lang === 'Vietsub + Thuyết minh' ? 'Vsub+TM' : item.lang}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => navigate(`/xem-phim/${item.slug}`)}
                    className='flex items-center justify-center gap-1.5 w-full py-2 bg-red-600 hover:bg-red-700
                        text-white text-[12px] font-medium rounded-lg transition'
                >
                    <FaPlay size={9} /> Xem ngay
                </button>
            </div>
        </div>,
        document.body
    )
}

export default function MovieItemCard({ item, layout = 'grid' }) {
    const { toggle, isIn } = useWatchlist()
    const [hovered, setHovered] = useState(false)
    const timerRef = useRef(null)
    const anchorRef = useRef(null)
    const popupHoveredRef = useRef(false)

    useEffect(() => () => clearTimeout(timerRef.current), [])

    useEffect(() => {
        if (!hovered) return
        const close = () => { popupHoveredRef.current = false; setHovered(false) }
        window.addEventListener('scroll', close, { passive: true })
        return () => window.removeEventListener('scroll', close)
    }, [hovered])

    if (!item) return null

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
        category: item.category,
    }

    function handleMouseEnter() {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setHovered(true), 400)
    }

    function handleMouseLeave() {
        clearTimeout(timerRef.current)
        // Delay để check xem mouse có di sang popup không
        timerRef.current = setTimeout(() => {
            if (!popupHoveredRef.current) setHovered(false)
        }, 80)
    }

    function handleHeart(e) {
        e.preventDefault()
        e.stopPropagation()
        toggle(movieData)
    }

    if (layout === 'section') {
        return (
            <div
                ref={anchorRef}
                className='movies-card_item'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link to={`/phim/${item.slug}`}>
                    <div className='relative group'>
                        <img src={`${base_url}/${item.thumb_url}`} alt={item.name}
                            loading='lazy' decoding='async'
                            className='w-full rounded-lg aspect-[2/3] md:aspect-video md:object-cover' />
                        <div className="absolute bottom-[-1px] left-2 flex gap-1 max-w-[calc(100%-8px)]">
                            <LangBadge lang={item.lang} className='max-w-[60%] truncate' />
                            <span className='movies-card_episode whitespace-nowrap flex-shrink-0'>{item.episode_current}</span>
                        </div>
                        <button
                            onClick={handleHeart}
                            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-all duration-200
                                ${inWatchlist ? 'bg-pink-500/90 text-white opacity-100' : 'bg-black/50 text-white hover:bg-pink-500/80'}`}
                        >
                            {inWatchlist ? <FaHeart size={11} /> : <FaRegHeart size={11} />}
                        </button>
                    </div>
                    <h3 className={`movies-card_name mt-2 text-[15px] transition-opacity duration-150 ${hovered ? 'opacity-0' : ''}`}>{item.name}</h3>
                    <h4 className={`text-[12px] text-[#aaaaaa] line-clamp-1 transition-opacity duration-150 ${hovered ? 'opacity-0' : ''}`}>{item.origin_name}</h4>
                </Link>

                <HoverPreview item={item} visible={hovered} anchorRef={anchorRef} popupHoveredRef={popupHoveredRef} onClose={() => setHovered(false)} />
            </div>
        )
    }

    // grid layout
    return (
        <div
            ref={anchorRef}
            className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link to={`/phim/${item.slug}`}>
                <div className='relative group'>
                    <img
                        loading='lazy'
                        decoding='async'
                        className='w-full aspect-[2/3] object-cover rounded-lg'
                        src={`${base_url}/${item.thumb_url}`}
                        alt={item.name}
                    />
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

            <HoverPreview item={item} visible={hovered} anchorRef={anchorRef} popupHoveredRef={popupHoveredRef} onClose={() => setHovered(false)} />
        </div>
    )
}
