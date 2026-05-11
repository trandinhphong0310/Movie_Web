import { useParams, Link } from 'react-router-dom'
import { FaPlay, FaStar, FaClock, FaFilm, FaGlobe, FaUser } from 'react-icons/fa'
import { useMovieDetail } from '../../hooks/useMovieDetail'
import ActorList from '../shared/ActorList'
import EpisodeList from '../shared/EpisodeList'

const base_url = import.meta.env.VITE_BASE_IMG_URL

// Small helper for info rows
function InfoRow({ icon, label, value }) {
    if (!value) return null
    return (
        <div className='flex items-start gap-3 py-3 border-b border-white/5'>
            <span className='text-red-400 mt-0.5 flex-shrink-0'>{icon}</span>
            <div className='flex-1 min-w-0'>
                <p className='text-gray-500 text-[11px] uppercase tracking-wider mb-0.5'>{label}</p>
                <p className='text-gray-200 text-[13px]'>{value}</p>
            </div>
        </div>
    )
}

export default function MoviesCard() {
    const { slug } = useParams()
    const { movies, category, country, episodes, imdb, actor, loading } = useMovieDetail(slug)

    if (loading || !movies) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='text-center'>
                    <div className='w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3' />
                    <p className='text-gray-400 text-sm'>Đang tải...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 pt-[80px] md:pt-[100px] pb-16'>
            <div className='flex flex-col lg:flex-row gap-6'>

                {/* ── Left panel ── */}
                <div className='lg:w-[320px] xl:w-[360px] flex-shrink-0'>
                    <div className='bg-[rgba(25,27,36,0.6)] rounded-2xl overflow-hidden border border-white/5'>

                        {/* Poster hero */}
                        <div className='relative'>
                            <img
                                src={`${base_url}/${movies.thumb_url}`}
                                alt={movies.name}
                                className='w-full aspect-video object-cover'
                            />
                            {/* gradient overlay bottom */}
                            <div className='absolute inset-0 bg-gradient-to-t from-[#191b24] via-transparent to-transparent' />

                            {/* Badges over poster */}
                            <div className='absolute bottom-3 left-3 flex gap-2 flex-wrap'>
                                {movies.quality && (
                                    <span className='text-[11px] px-2 py-0.5 bg-red-500/90 text-white rounded font-semibold'>
                                        {movies.quality}
                                    </span>
                                )}
                                {movies.lang && (
                                    <span className='text-[11px] px-2 py-0.5 bg-emerald-600/90 text-white rounded font-semibold'>
                                        {movies.lang}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title block */}
                        <div className='px-5 pt-4 pb-3 border-b border-white/5'>
                            <h1 className='text-white text-[18px] sm:text-[20px] font-bold leading-snug mb-1'>
                                {movies.name}
                            </h1>
                            <h2 className='text-[#ffd875] text-[13px] italic'>{movies.origin_name}</h2>

                            {/* Meta chips */}
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {movies.year && (
                                    <span className='text-[12px] px-2.5 py-1 rounded-lg bg-white/10 text-gray-300'>
                                        {movies.year}
                                    </span>
                                )}
                                {movies.episode_total && (
                                    <span className='text-[12px] px-2.5 py-1 rounded-lg bg-white/10 text-gray-300'>
                                        {movies.episode_total}
                                    </span>
                                )}
                                {category.slice(0, 2).map(item => (
                                    <span key={item.id} className='text-[12px] px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/20'>
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Info rows */}
                        <div className='px-5 py-1'>
                            <InfoRow icon={<FaClock size={12} />} label='Thời lượng' value={movies.time} />
                            <InfoRow icon={<FaUser size={12} />} label='Đạo diễn' value={movies.director} />
                            <InfoRow icon={<FaGlobe size={12} />} label='Quốc gia' value={country?.name} />
                            <InfoRow icon={<FaFilm size={12} />} label='Thể loại'
                                value={category.map(c => c.name).join(', ')} />
                        </div>

                        {/* Description */}
                        {movies.content && (
                            <div className='px-5 pb-4 pt-2 border-t border-white/5 mt-1'>
                                <p className='text-[11px] text-gray-500 uppercase tracking-wider mb-2'>Giới thiệu</p>
                                <div
                                    className='text-gray-400 text-[13px] leading-relaxed line-clamp-4'
                                    dangerouslySetInnerHTML={{ __html: movies.content }}
                                />
                            </div>
                        )}

                        {/* Actors */}
                        {actor.length > 0 && (
                            <div className='px-5 pb-5 border-t border-white/5 pt-4'>
                                <ActorList actors={actor} limit={6} />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right panel ── */}
                <div className='flex-1 min-w-0'>
                    <div className='bg-[rgba(25,27,36,0.4)] rounded-2xl p-5 md:p-6 border border-white/5'>

                        {/* Action row */}
                        <div className='flex flex-wrap items-center justify-between gap-3 mb-8'>
                            <Link to={`/xem-phim/${slug}?ep=1`}>
                                <button className='cursor-pointer flex gap-2 items-center justify-center
                                    px-6 py-3 rounded-xl text-[15px] font-semibold text-[#1a1600]
                                    bg-gradient-to-r from-[#FECF59] to-[#f59e0b]
                                    hover:from-[#f59e0b] hover:to-[#FECF59]
                                    shadow-[0_0_20px_rgba(254,207,89,0.3)] hover:shadow-[0_0_28px_rgba(254,207,89,0.5)]
                                    transition-all duration-300'>
                                    <FaPlay className='text-[13px]' /> Xem ngay
                                </button>
                            </Link>

                            {imdb?.vote_average > 0 && (
                                <div className='flex items-center gap-3 px-4 py-2.5 rounded-xl
                                    bg-gradient-to-r from-[#1e2130] to-[#252840]
                                    border border-white/5'>
                                    <FaStar className='text-yellow-400 text-[18px]' />
                                    <div>
                                        <p className='text-white font-bold text-[16px] leading-none'>{imdb.vote_average}</p>
                                        <p className='text-gray-500 text-[11px] mt-0.5'>IMDB</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <EpisodeList episodes={episodes} slug={slug} />
                    </div>
                </div>

            </div>
        </div>
    )
}
