import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useMovieDetail } from '../../hooks/useMovieDetail'
import ActorList from '../shared/ActorList'
import EpisodeList from '../shared/EpisodeList'
import { FaStar, FaArrowLeft, FaClock, FaFilm } from 'react-icons/fa'

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
    const { movies, category, episodes, servers, imdb, tmdb, director, peoples, loading } = useMovieDetail(slug)

    // Server đang chọn (index)
    const [serverIdx, setServerIdx] = useState(0)
    const activeServerData = servers[serverIdx]?.server_data || episodes

    const epParam = searchParams.get('ep')
    const currentEpisode = activeServerData.find(e => e.name === epParam) || activeServerData[0] || null

    // Scroll lên đầu khi đổi tập
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [epParam])

    // Reset server về 0 khi đổi phim
    useEffect(() => {
        setServerIdx(0)
    }, [slug])

    if (loading || !movies) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-10 h-10 border-4 border-white/20 border-t-red-500 rounded-full animate-spin' />
                    <span className='text-white/60 text-sm'>Đang tải phim...</span>
                </div>
            </div>
        )
    }

    if (!currentEpisode) {
        return <div className='text-white text-center py-20'>Không tìm thấy tập phim.</div>
    }

    const rating = imdb?.vote_average || tmdb?.vote_average || null

    return (
        <div className='pt-[60px] md:pt-[120px]'>

            {/* ── Video Player Full Width ── */}
            <div className='w-full bg-black' style={{ aspectRatio: '14/7' }} >
                <div className='relative w-full h-full'>
                {currentEpisode?.link_embed ? (
                    <iframe
                        key={currentEpisode.link_embed}
                        src={currentEpisode.link_embed}
                        frameBorder='0'
                        allowFullScreen
                        allow='autoplay; encrypted-media; picture-in-picture'
                        width='100%'
                        height='100%'
                        title={`${movies.name} - Tập ${currentEpisode.name}`}
                        className='absolute inset-0 w-full h-full'
                    />
                ) : (
                    <div className='flex items-center justify-center h-full text-white/40 text-sm'>
                        Không có nguồn phát
                    </div>
                )}
                </div>
            </div>

            {/* ── Controls Bar: title + server selector ── */}
            <div className='bg-[#0d0f18] border-b border-white/5 px-4 md:px-8 py-3'>
                <div className='max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>

                    {/* Tên phim + tập */}
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

                    {/* Chọn server */}
                    {servers.length > 1 && (
                        <div className='flex items-center gap-2 flex-shrink-0'>
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

            {/* ── Nội dung bên dưới ── */}
            <div className='max-w-[1400px] mx-auto px-4 md:px-8 py-6'>

                {/* Danh sách tập */}
                <EpisodeList episodes={activeServerData} slug={slug} activeEp={epParam} />

                {/* Info phim */}
                <div className='mt-8 flex flex-col lg:flex-row gap-6'>

                    {/* Poster */}
                    <div className='flex-shrink-0'>
                        <img
                            src={`${base_url}/${movies.thumb_url}`}
                            alt={movies.name}
                            loading='lazy'
                            className='w-full sm:w-[180px] lg:w-[200px] rounded-xl object-cover shadow-2xl'
                        />
                    </div>

                    {/* Meta */}
                    <div className='flex-1 min-w-0'>

                        {/* Tên + rating */}
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

                        {/* Badges */}
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

                        {/* Thể loại */}
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

                        {/* Đạo diễn */}
                        {director.length > 0 && (
                            <p className='text-[13px] text-gray-400 mb-2'>
                                <span className='text-gray-300 font-medium'>Đạo diễn:</span>{' '}
                                {director.join(', ')}
                            </p>
                        )}

                        {/* Mô tả */}
                        <div
                            className='text-gray-400 text-[14px] leading-relaxed line-clamp-4 lg:line-clamp-none'
                            dangerouslySetInnerHTML={{ __html: movies.content }}
                        />
                    </div>

                    {/* Diễn viên (desktop) */}
                    {peoples.length > 0 && (
                        <div className='hidden lg:block flex-shrink-0 w-[200px]'>
                            <ActorList actors={peoples} limit={5} />
                        </div>
                    )}
                </div>

                {/* Diễn viên (mobile) */}
                {peoples.length > 0 && (
                    <div className='lg:hidden mt-6'>
                        <ActorList actors={peoples} limit={6} />
                    </div>
                )}
            </div>
        </div>
    )
}
