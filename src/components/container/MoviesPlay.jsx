import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useMovieDetail } from '../../hooks/useMovieDetail'
import { saveToHistory } from '../../hooks/useWatchHistory'
import ActorList from '../shared/ActorList'
import EpisodeList from '../shared/EpisodeList'
import { SkeletonPlayer } from '../shared/SkeletonCard'
import { FaStar, FaArrowLeft, FaClock, FaFilm, FaTimes, FaExpand } from 'react-icons/fa'

const base_url = import.meta.env.VITE_BASE_IMG_URL

const LANG_MAP = {
    'Vietsub':               { label: 'Vietsub',        cls: 'bg-emerald-700/70 text-emerald-200' },
    'Vietsub + Thuyết minh': { label: 'Vietsub + TM',   cls: 'bg-blue-700/60 text-blue-200' },
    'Thuyết minh':           { label: 'Thuyết minh',    cls: 'bg-blue-700/60 text-blue-200' },
    'Lồng tiếng':            { label: 'Lồng tiếng',     cls: 'bg-purple-700/60 text-purple-200' },
}

function LangBadge({ lang }) {
    if (!lang) return null
    const config = LANG_MAP[lang] || { label: lang, cls: 'bg-white/10 text-gray-300' }
    return <span className={`px-2.5 py-1 text-[12px] rounded-md ${config.cls}`}>{config.label}</span>
}

export default function MoviesPlay() {
    const { slug } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { movies, category, episodes, servers, imdb, tmdb, director, peoples, loading } = useMovieDetail(slug)

    const [serverIdx, setServerIdx] = useState(0)
    const activeServerData = servers[serverIdx]?.server_data || episodes

    const epParam = searchParams.get('ep')
    const currentEpisode = activeServerData.find(e => e.name === epParam) || activeServerData[0] || null

    // Mini player state
    const playerContainerRef = useRef(null)
    const miniDismissedRef = useRef(false)
    const [isMini, setIsMini] = useState(false)
    const [miniDismissed, setMiniDismissed] = useState(false)

    const iframeRef = useRef(null)

    useEffect(() => {
        miniDismissedRef.current = miniDismissed
    }, [miniDismissed])

    // IntersectionObserver cho mini player
    useEffect(() => {
        const el = playerContainerRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!miniDismissedRef.current) setIsMini(!entry.isIntersecting)
            },
            { threshold: 0 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Reset mini player khi đổi tập
    useEffect(() => {
        setIsMini(false)
        setMiniDismissed(false)
        miniDismissedRef.current = false
    }, [currentEpisode?.link_embed])

    // Lưu lịch sử xem khi bắt đầu xem tập
    useEffect(() => {
        if (!movies || !currentEpisode) return
        saveToHistory({
            slug,
            name: movies.name,
            origin_name: movies.origin_name,
            thumb_url: movies.thumb_url,
            epName: currentEpisode.name,
            watchedAt: Date.now(),
        })
    }, [slug, movies, currentEpisode])

    // Dynamic page title
    useEffect(() => {
        if (!movies?.name) return
        const ep = currentEpisode?.name && currentEpisode.name !== 'Full' ? ` - Tập ${currentEpisode.name}` : ''
        document.title = `${movies.name}${ep} | CineHub`
        return () => { document.title = 'CineHub' }
    }, [movies?.name, currentEpisode?.name])

    // Scroll lên đầu khi đổi tập
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [epParam])

    // Reset server về 0 khi đổi phim
    useEffect(() => {
        setServerIdx(0)
    }, [slug])

    const toggleFullscreen = () => {
        const el = iframeRef.current || playerContainerRef.current
        if (!el) return
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            el.requestFullscreen?.()
        }
    }

    // Keyboard shortcuts (n/p chuyển tập, f fullscreen, Esc quay lại)
    // Arrow ← → không bắt ở đây để iframe player tự xử lý seek
    useEffect(() => {
        const handleKey = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
            const currentName = epParam || activeServerData[0]?.name
            const idx = activeServerData.findIndex(ep => ep.name === currentName)

            if (e.key === 'n') {
                const next = activeServerData[idx + 1]
                if (next) navigate(`/xem-phim/${slug}?ep=${next.name}`)
            }
            if (e.key === 'p') {
                const prev = activeServerData[idx - 1]
                if (prev) navigate(`/xem-phim/${slug}?ep=${prev.name}`)
            }
            if (e.key === 'Escape') navigate(`/phim/${slug}`)
            if (e.key === 'f' || e.key === 'F') toggleFullscreen()
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [slug, epParam, activeServerData, navigate])

    if (loading || !movies) return <SkeletonPlayer />
    if (!currentEpisode) return <div className='text-white text-center py-20'>Không tìm thấy tập phim.</div>

    const rating = imdb?.vote_average || tmdb?.vote_average || null

    const showMiniPlayer = isMini && !miniDismissed && currentEpisode?.link_embed

    return (
        <div className='pt-[60px] md:pt-[120px]'>

            {/* ── Video Player Full Width ── */}
            <div ref={playerContainerRef} className='w-full bg-black relative' style={{ aspectRatio: '14/7' }}>
                {/* Inner div: bình thường fill full, khi mini → fixed ở góc */}
                <div className={
                    showMiniPlayer
                        ? 'fixed bottom-4 right-4 z-[200] w-[300px] sm:w-[360px] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/20'
                        : 'absolute inset-0'
                }>
                    {showMiniPlayer && (
                        <div className='absolute top-2 right-2 z-10 flex gap-1.5'>
                            <button
                                onClick={() => navigate(`/xem-phim/${slug}?ep=${currentEpisode.name}`)}
                                className='w-7 h-7 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-white/20 transition'
                                title='Mở rộng'
                            >
                                <FaExpand size={10} />
                            </button>
                            <button
                                onClick={() => { setMiniDismissed(true); miniDismissedRef.current = true }}
                                className='w-7 h-7 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-500 transition'
                                title='Đóng'
                            >
                                <FaTimes size={10} />
                            </button>
                        </div>
                    )}
                    {currentEpisode?.link_embed ? (
                        <iframe
                            ref={iframeRef}
                            key={currentEpisode.link_embed}
                            src={currentEpisode.link_embed}
                            frameBorder='0'
                            allowFullScreen
                            allow='autoplay; encrypted-media; picture-in-picture; fullscreen'
                            title={`${movies.name} - Tập ${currentEpisode.name}`}
                            className={showMiniPlayer ? 'w-full aspect-video block' : 'absolute inset-0 w-full h-full'}
                        />
                    ) : (
                        <div className='flex items-center justify-center h-full text-white/40 text-sm'>
                            Không có nguồn phát
                        </div>
                    )}
                </div>
            </div>

            {/* ── Controls Bar ── */}
            <div className='bg-[#0d0f18] border-b border-white/5 px-4 md:px-8 py-3'>
                <div className='max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>

                    <div className='flex items-center gap-3 min-w-0'>
                        <Link to={`/phim/${slug}`}
                            className='flex-shrink-0 flex items-center gap-1 text-white/50 hover:text-white transition text-sm'>
                            <FaArrowLeft className='w-3 h-3' /> Quay lại
                        </Link>
                        <span className='text-white/20'>|</span>
                        <h1 className='text-white font-semibold text-[15px] truncate'>
                            {movies.name}
                            {currentEpisode.name && currentEpisode.name !== 'Full' &&
                                <span className='text-gray-400 font-normal'> — Tập {currentEpisode.name}</span>
                            }
                        </h1>
                    </div>

                    <div className='flex items-center gap-4 flex-shrink-0'>
                        {/* Keyboard hint */}
                        <span className='hidden lg:flex items-center gap-2 text-gray-600 text-[11px]'>
                            <kbd className='px-1.5 py-0.5 bg-white/5 rounded text-[10px]'>n</kbd>
                            <kbd className='px-1.5 py-0.5 bg-white/5 rounded text-[10px]'>p</kbd>
                            chuyển tập
                            <kbd className='px-1.5 py-0.5 bg-white/5 rounded text-[10px] ml-1'>F</kbd>
                            toàn màn hình
                            <kbd className='px-1.5 py-0.5 bg-white/5 rounded text-[10px] ml-1'>Esc</kbd>
                            quay lại
                        </span>

                        {servers.length > 1 && (
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-500 text-[12px] uppercase tracking-wide'>Server:</span>
                                <div className='flex gap-1.5 flex-wrap'>
                                    {servers.map((sv, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setServerIdx(idx)}
                                            className={`px-3 py-1 text-[12px] rounded-md border transition-all ${idx === serverIdx
                                                ? 'bg-red-600 border-red-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                                                }`}
                                        >
                                            {sv.server_name || `Server ${idx + 1}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Nội dung bên dưới ── */}
            <div className='max-w-[1400px] mx-auto px-4 md:px-8 py-6'>
                <EpisodeList episodes={activeServerData} slug={slug} activeEp={epParam} />

                <div className='mt-8 flex flex-col lg:flex-row gap-6'>
                    <div className='flex-shrink-0'>
                        <img
                            src={`${base_url}/${movies.thumb_url}`}
                            alt={movies.name}
                            loading='lazy'
                            className='w-full sm:w-[180px] lg:w-[200px] rounded-xl object-cover shadow-2xl'
                        />
                    </div>

                    <div className='flex-1 min-w-0'>
                        <div className='flex flex-wrap items-start gap-3 mb-3'>
                            <h2 className='text-white text-[22px] md:text-[28px] font-bold leading-tight'>{movies.name}</h2>
                            {rating && (
                                <span className='flex items-center gap-1 bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 px-2.5 py-1 rounded-lg text-[13px] font-semibold mt-1'>
                                    <FaStar className='w-3 h-3' />
                                    {Number(rating).toFixed(1)}
                                </span>
                            )}
                        </div>

                        <p className='text-gray-500 text-[14px] mb-4 italic'>{movies.origin_name}</p>

                        <div className='flex flex-wrap gap-2 mb-4'>
                            {movies.quality && <span className='px-2.5 py-1 text-[12px] bg-red-600/80 text-white rounded-md font-medium'>{movies.quality}</span>}
                            {movies.lang && <LangBadge lang={movies.lang} />}
                            {movies.year && <span className='px-2.5 py-1 text-[12px] bg-white/10 text-gray-300 rounded-md'>{movies.year}</span>}
                            {movies.episode_current && <span className='px-2.5 py-1 text-[12px] bg-white/10 text-gray-300 rounded-md'>{movies.episode_current}</span>}
                            {movies.time && (
                                <span className='flex items-center gap-1 px-2.5 py-1 text-[12px] bg-white/10 text-gray-300 rounded-md'>
                                    <FaClock className='w-3 h-3' />{movies.time}
                                </span>
                            )}
                        </div>

                        {category.length > 0 && (
                            <div className='flex flex-wrap gap-1.5 mb-4'>
                                {category.map(c => (
                                    <Link key={c.id} to={`/the-loai/${c.slug}?page=1&limit=24`}
                                        className='text-[12px] px-2.5 py-1 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition'>
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {director.length > 0 && (
                            <p className='text-[13px] text-gray-400 mb-2'>
                                <span className='text-gray-300 font-medium'>Đạo diễn:</span>{' '}
                                {director.join(', ')}
                            </p>
                        )}

                        <div
                            className='text-gray-400 text-[14px] leading-relaxed line-clamp-4 lg:line-clamp-none'
                            dangerouslySetInnerHTML={{ __html: movies.content }}
                        />
                    </div>

                    {peoples.length > 0 && (
                        <div className='hidden lg:block flex-shrink-0 w-[200px]'>
                            <ActorList actors={peoples} limit={5} />
                        </div>
                    )}
                </div>

                {peoples.length > 0 && (
                    <div className='lg:hidden mt-6'>
                        <ActorList actors={peoples} limit={6} />
                    </div>
                )}
            </div>
        </div>
    )
}
