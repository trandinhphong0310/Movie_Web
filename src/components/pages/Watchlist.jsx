import { Link } from 'react-router-dom'
import { FaHeart, FaTrash, FaPlay } from 'react-icons/fa'
import { useWatchlist } from '../../hooks/useWatchlist'

const base_url = import.meta.env.VITE_BASE_IMG_URL

export default function Watchlist() {
    const { watchlist, toggle } = useWatchlist()

    return (
        <div className='container mx-auto px-4 pt-[100px] md:pt-[120px] pb-16 min-h-screen'>
            <div className='flex items-center gap-3 mb-8'>
                <FaHeart className='text-pink-400 text-xl' />
                <h1 className='text-white text-[24px] font-bold'>Yêu thích</h1>
                {watchlist.length > 0 && (
                    <span className='text-gray-500 text-[14px]'>({watchlist.length} phim)</span>
                )}
            </div>

            {watchlist.length === 0 ? (
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
                        <div key={item.slug} className='group relative'>
                            <Link to={`/phim/${item.slug}`}>
                                <div className='relative overflow-hidden rounded-lg aspect-[2/3]'>
                                    <img
                                        src={`${base_url}/${item.thumb_url}`}
                                        alt={item.name}
                                        loading='lazy'
                                        className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                                    />
                                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
                                        <div className='w-10 h-10 rounded-full bg-red-500/90 flex items-center justify-center'>
                                            <FaPlay className='text-white text-sm ml-0.5' />
                                        </div>
                                    </div>
                                    {item.quality && (
                                        <div className='absolute bottom-2 left-2'>
                                            <span className='text-[11px] px-2 py-0.5 bg-red-500/90 text-white rounded font-medium'>
                                                {item.quality}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h3 className='text-white text-[13px] font-medium mt-2 line-clamp-2 leading-snug'>
                                    {item.name}
                                </h3>
                                {item.year && (
                                    <p className='text-gray-600 text-[11px] mt-0.5'>{item.year}</p>
                                )}
                            </Link>
                            <button
                                onClick={() => toggle(item)}
                                className='absolute top-2 right-2 w-7 h-7 rounded-full bg-pink-500/90 text-white
                                    opacity-0 group-hover:opacity-100 transition flex items-center justify-center
                                    hover:bg-red-500'
                                title='Xóa khỏi yêu thích'
                            >
                                <FaTrash size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
