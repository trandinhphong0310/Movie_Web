import { Link } from 'react-router-dom'
import { FaHeart, FaTrash, FaPlay } from 'react-icons/fa'
import { useWatchlist } from '../../hooks/useWatchlist'
import { useGetMoviesDetailQuery } from '../../redux/services/movieApi'

const base_url = import.meta.env.VITE_BASE_IMG_URL

function FavoriteCard({ item, onRemove }) {
    const needsFetch = !item.thumb_url
    const { data, isLoading } = useGetMoviesDetailQuery(item.slug, { skip: !needsFetch })

    const movie = needsFetch
        ? (data?.item ? {
            slug: item.slug,
            name: data.item.name,
            thumb_url: data.item.thumb_url,
            year: data.item.year,
            quality: data.item.quality,
        } : null)
        : item

    if (isLoading && !movie) return (
        <div className='animate-pulse'>
            <div className='rounded-lg aspect-[2/3] bg-white/5' />
            <div className='h-3 bg-white/5 rounded mt-3 w-3/4' />
        </div>
    )

    const safeMovie = movie || item
    const displayName = safeMovie.name || safeMovie.slug || 'Phim không xác định'
    const displayThumb = safeMovie.thumb_url ? `${base_url}/${safeMovie.thumb_url}` : 'https://placehold.co/400x600/2f3346/white?text=No+Image'

    return (
        <div className='group relative'>
            <Link to={`/phim/${safeMovie.slug}`}>
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
                    {safeMovie.quality && (
                        <div className='absolute bottom-2 left-2'>
                            <span className='text-[11px] px-2 py-0.5 bg-pink-500/90 backdrop-blur-sm text-white rounded font-medium shadow-lg'>
                                {safeMovie.quality}
                            </span>
                        </div>
                    )}
                </div>
                <h3 className='text-white text-[13px] font-medium mt-3 line-clamp-2 leading-snug group-hover:text-pink-400 transition-colors'>
                    {displayName}
                </h3>
                {safeMovie.year && (
                    <p className='text-white/40 text-[11px] mt-1'>{safeMovie.year}</p>
                )}
            </Link>
            <button
                onClick={() => onRemove(item)}
                className='absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70
                    md:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center
                    hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-110 shadow-lg'
                title='Xóa khỏi yêu thích'
            >
                <FaTrash size={12} />
            </button>
        </div>
    )
}

export default function Watchlist() {
    const { watchlist, toggle, isLoading, clearAll } = useWatchlist()

    function handleClear() {
        if (window.confirm('Xóa toàn bộ phim yêu thích?')) {
            clearAll()
        }
    }

    return (
        <div className='container mx-auto px-4 pt-[100px] md:pt-[120px] pb-16 min-h-screen'>
            <div className='flex justify-between items-center mb-8'>
                <div className='flex items-center gap-3'>
                    <FaHeart className='text-pink-400 text-xl' />
                    <h1 className='text-white text-[24px] font-bold'>Yêu thích</h1>
                    {watchlist.length > 1 && (
                        <span className='text-gray-500 text-[14px]'>({watchlist.length} phim)</span>
                    )}
                </div>
                {watchlist.length > 1 && (
                    <button
                        onClick={handleClear}
                        className='flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium
                        bg-white/5 border border-white/10 text-white/60 backdrop-blur-sm
                        hover:bg-pink-500/20 hover:border-pink-500/30 hover:text-pink-400 transition-all duration-300'
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
            ) : watchlist.length === 0 ? (
                <div className='flex items-center justify-center py-24'>
                    <p className='text-white/50 text-[16px]'>Danh sách yêu thích của bạn đang trống</p>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-4'>
                    {watchlist.map(item => (
                        <FavoriteCard key={item.slug} item={item} onRemove={toggle} />
                    ))}
                </div>
            )}
        </div>
    )
}
