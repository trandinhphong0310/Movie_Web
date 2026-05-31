import { Link } from 'react-router-dom'
import { FaPlay, FaTrash, FaClock } from 'react-icons/fa'
import { readHistory, useWatchHistory } from '../../hooks/useWatchHistory'
import { useGetMoviesDetailQuery } from '../../redux/services/movieApi'

const base_url = import.meta.env.VITE_BASE_IMG_URL

function timeAgo(ts) {
    const diff = Date.now() - ts
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'Vừa xong'
    if (m < 60) return `${m} phút trước`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} giờ trước`
    const d = Math.floor(h / 24)
    return `${d} ngày trước`
}

function HistoryCard({ item, onRemove }) {
    // item from API: { slug, epName, watchedAt } — no name/thumb_url
    // item from localStorage: full data
    const needsFetch = !item.thumb_url

    // Check localStorage cache first (fast, no network)
    const localEntry = needsFetch ? readHistory().find(h => h.slug === item.slug) : null
    const hasLocal = !!(localEntry?.thumb_url)

    const { data, isLoading } = useGetMoviesDetailQuery(item.slug, {
        skip: !needsFetch || hasLocal,
    })

    let movie = item
    if (needsFetch) {
        if (hasLocal) {
            movie = { ...item, name: localEntry.name, thumb_url: localEntry.thumb_url }
        } else if (data?.item) {
            movie = { ...item, name: data.item.name, thumb_url: data.item.thumb_url }
        } else if (isLoading) {
            movie = null
        }
    }

    if (!movie) return (
        <div className='animate-pulse'>
            <div className='rounded-lg aspect-[2/3] bg-white/5' />
            <div className='h-3 bg-white/5 rounded mt-2 w-3/4' />
            <div className='h-2 bg-white/5 rounded mt-1 w-1/2' />
        </div>
    )

    const epLink = movie.epName ? `/xem-phim/${movie.slug}?ep=${movie.epName}` : `/xem-phim/${movie.slug}`

    return (
        <div className='group relative'>
            <Link to={epLink}>
                <div className='relative overflow-hidden rounded-lg aspect-[2/3]'>
                    <img
                        src={`${base_url}/${movie.thumb_url}`}
                        alt={movie.name}
                        loading='lazy'
                        className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
                        <div className='w-10 h-10 rounded-full bg-red-500/90 flex items-center justify-center'>
                            <FaPlay className='text-white text-sm ml-0.5' />
                        </div>
                    </div>
                    {movie.epName && (
                        <div className='absolute bottom-2 left-2'>
                            <span className='text-[11px] px-2 py-0.5 bg-red-500/90 text-white rounded font-medium'>
                                Tập {movie.epName}
                            </span>
                        </div>
                    )}
                </div>
                <h3 className='text-white text-[13px] font-medium mt-2 line-clamp-2 leading-snug'>
                    {movie.name}
                </h3>
                <p className='text-gray-600 text-[11px] mt-0.5'>
                    {timeAgo(movie.watchedAt)}
                </p>
            </Link>
            <button
                onClick={() => onRemove(movie.slug)}
                className='absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white
                    opacity-0 group-hover:opacity-100 transition flex items-center justify-center
                    hover:bg-red-500'
            >
                <FaTrash size={10} />
            </button>
        </div>
    )
}

export default function WatchHistory() {
    const { history, removeHistory, clearAll, isLoading } = useWatchHistory()

    function handleClear() {
        if (window.confirm('Xóa toàn bộ lịch sử xem?')) {
            clearAll()
        }
    }

    return (
        <div className='container mx-auto px-4 pt-[100px] md:pt-[120px] pb-16 min-h-screen'>
            <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center gap-3'>
                    <FaClock className='text-red-400 text-xl' />
                    <h1 className='text-white text-[24px] font-bold'>Lịch sử xem</h1>
                    {history.length > 0 && (
                        <span className='text-gray-500 text-[14px]'>({history.length} phim)</span>
                    )}
                </div>
                {history.length > 0 && (
                    <button
                        onClick={handleClear}
                        className='flex items-center gap-2 px-4 py-2 rounded-lg text-[13px]
                            bg-white/5 border border-white/10 text-gray-400
                            hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition'
                    >
                        <FaTrash size={12} /> Xóa tất cả
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className='animate-pulse'>
                            <div className='rounded-lg aspect-[2/3] bg-white/5' />
                            <div className='h-3 bg-white/5 rounded mt-2 w-3/4' />
                        </div>
                    ))}
                </div>
            ) : history.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 gap-4'>
                    <FaClock className='text-white/10 text-6xl' />
                    <p className='text-gray-500 text-[16px]'>Chưa có lịch sử xem</p>
                    <Link to='/' className='text-red-400 hover:text-red-300 text-[14px] transition'>
                        Khám phá phim ngay →
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                    {history.map(item => (
                        <HistoryCard key={item.slug} item={item} onRemove={removeHistory} />
                    ))}
                </div>
            )}
        </div>
    )
}
