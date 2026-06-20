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
    const needsFetch = !item.thumb_url
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

    if (isLoading && !movie) return (
        <div className='animate-pulse'>
            <div className='rounded-lg aspect-[2/3] bg-white/5' />
            <div className='h-3 bg-white/5 rounded mt-3 w-3/4' />
            <div className='h-2 bg-white/5 rounded mt-2 w-1/2' />
        </div>
    )

    const safeMovie = movie || item
    const displayName = safeMovie.name || safeMovie.slug || 'Phim không xác định'
    const displayThumb = safeMovie.thumb_url ? `${base_url}/${safeMovie.thumb_url}` : 'https://placehold.co/400x600/2f3346/white?text=No+Image'
    const epLink = safeMovie.epName ? `/xem-phim/${safeMovie.slug}?ep=${encodeURIComponent(safeMovie.epName)}` : `/xem-phim/${safeMovie.slug}`

    return (
        <div className='group relative'>
            <Link to={epLink}>
                <div className='relative overflow-hidden rounded-lg aspect-[2/3] bg-[#2f3346]'>
                    <img
                        src={displayThumb}
                        alt={displayName}
                        loading='lazy'
                        className='w-full h-full object-cover group-hover:scale-105 transition duration-500'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center'>
                        <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300'>
                            <FaPlay className='text-white text-sm ml-1' />
                        </div>
                    </div>
                    {safeMovie.epName && (
                        <div className='absolute bottom-2 left-2'>
                            <span className='text-[11px] px-2 py-0.5 bg-red-500/90 backdrop-blur-sm text-white rounded font-medium shadow-lg'>
                                Tập {safeMovie.epName}
                            </span>
                        </div>
                    )}
                </div>
                <h3 className='text-white text-[13px] font-medium mt-3 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors'>
                    {displayName}
                </h3>
                <p className='text-white/40 text-[11px] mt-1'>
                    {timeAgo(safeMovie.watchedAt)}
                </p>
            </Link>
            <button
                onClick={() => onRemove(safeMovie.slug)}
                className='absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70
                    md:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center
                    hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 shadow-lg'
                title='Xóa khỏi lịch sử'
            >
                <FaTrash size={12} />
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
                    {history.length > 1 && (
                        <span className='text-gray-500 text-[14px]'>({history.length} phim)</span>
                    )}
                </div>
                {history.length > 1 && (
                    <button
                        onClick={handleClear}
                        className='flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium
                            bg-white/5 border border-white/10 text-white/60 backdrop-blur-sm
                            hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all duration-300'
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
                            <div className='h-3 bg-white/5 rounded mt-3 w-3/4' />
                        </div>
                    ))}
                </div>
            ) : history.length === 0 ? (
                <div className='flex items-center justify-center py-24'>
                    <p className='text-white/50 text-[16px]'>Bạn chưa có lịch sử xem phim nào</p>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-4'>
                    {history.map(item => (
                        <HistoryCard key={item.slug} item={item} onRemove={removeHistory} />
                    ))}
                </div>
            )}
        </div>
    )
}
