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

    if (isLoading || !movie) return (
        <div className='animate-pulse'>
            <div className='rounded-lg aspect-[2/3] bg-white/5' />
            <div className='h-3 bg-white/5 rounded mt-2 w-3/4' />
        </div>
    )

    return (
        <div className='group relative'>
            <Link to={`/phim/${movie.slug}`}>
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
                    {movie.quality && (
                        <div className='absolute bottom-2 left-2'>
                            <span className='text-[11px] px-2 py-0.5 bg-red-500/90 text-white rounded font-medium'>
                                {movie.quality}
                            </span>
                        </div>
                    )}
                </div>
                <h3 className='text-white text-[13px] font-medium mt-2 line-clamp-2 leading-snug'>
                    {movie.name}
                </h3>
                {movie.year && (
                    <p className='text-gray-600 text-[11px] mt-0.5'>{movie.year}</p>
                )}
            </Link>
            <button
                onClick={() => onRemove(item)}
                className='absolute top-2 right-2 w-7 h-7 rounded-full bg-pink-500/90 text-white
                    opacity-0 group-hover:opacity-100 transition flex items-center justify-center
                    hover:bg-red-500'
                title='Xóa khỏi yêu thích'
            >
                <FaTrash size={10} />
            </button>
        </div>
    )
}

export default function Watchlist() {
    const { watchlist, toggle, isLoading } = useWatchlist()

    return (
        <div className='container mx-auto px-4 pt-[100px] md:pt-[120px] pb-16 min-h-screen'>
            <div className='flex items-center gap-3 mb-8'>
                <FaHeart className='text-pink-400 text-xl' />
                <h1 className='text-white text-[24px] font-bold'>Yêu thích</h1>
                {watchlist.length > 0 && (
                    <span className='text-gray-500 text-[14px]'>({watchlist.length} phim)</span>
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
            ) : watchlist.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 gap-4'>
                    <FaHeart className='text-white/10 text-6xl' />
                    <p className='text-gray-500 text-[16px]'>Chưa có phim yêu thích</p>
                    <Link to='/' className='text-red-400 hover:text-red-300 text-[14px] transition'>
                        Khám phá phim ngay →
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                    {watchlist.map(item => (
                        <FavoriteCard key={item.slug} item={item} onRemove={toggle} />
                    ))}
                </div>
            )}
        </div>
    )
}
