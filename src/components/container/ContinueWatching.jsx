import { Link } from 'react-router-dom'
import { FaPlay, FaTimes } from 'react-icons/fa'
import { readHistory, useWatchHistory } from '../../hooks/useWatchHistory'
import { useGetMoviesDetailQuery } from '../../redux/services/movieApi'

const base_url = import.meta.env.VITE_BASE_IMG_URL

function ContinueCard({ item, onRemove }) {
    const needsFetch = !item.thumb_url
    const localEntry = needsFetch ? readHistory().find(h => h.slug === item.slug) : null
    const hasLocal = !!(localEntry?.thumb_url)

    const { data } = useGetMoviesDetailQuery(item.slug, {
        skip: !needsFetch || hasLocal,
    })

    let movie = item
    if (needsFetch) {
        if (hasLocal) {
            movie = { ...item, name: localEntry.name, thumb_url: localEntry.thumb_url }
        } else if (data?.item) {
            movie = { ...item, name: data.item.name, thumb_url: data.item.thumb_url }
        }
    }

    function handleRemove(e) {
        e.preventDefault()
        e.stopPropagation()
        onRemove(item.slug)
    }

    const epLink = movie.epName ? `/xem-phim/${movie.slug}?ep=${encodeURIComponent(movie.epName)}` : `/xem-phim/${movie.slug}`

    return (
        <Link to={epLink} className='group relative'>
            <div className='relative rounded-lg overflow-hidden aspect-video bg-white/5'>
                {movie.thumb_url ? (
                    <img
                        src={`${base_url}/${movie.thumb_url}`}
                        alt={movie.name}
                        loading='lazy'
                        decoding='async'
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='w-full h-full animate-pulse bg-white/5' />
                )}
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <div className='w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                        <FaPlay className='text-white text-[12px] ml-0.5' />
                    </div>
                </div>
                {movie.epName && movie.epName !== 'Full' && movie.epName !== 'null' && (
                    <span className='absolute bottom-1.5 left-1.5 text-[10px] px-1.5 py-0.5 bg-black/70 text-gray-200 rounded'>
                        Tập {movie.epName}
                    </span>
                )}
                <button
                    onClick={handleRemove}
                    className='absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70
                        md:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center
                        hover:bg-red-500 hover:text-white hover:border-red-500 shadow-lg'
                    title='Xóa khỏi lịch sử'
                >
                    <FaTimes size={10} />
                </button>
            </div>
            <p className='text-gray-300 text-[12px] mt-1.5 line-clamp-2 leading-tight group-hover:text-white transition-colors'>
                {movie.name || '...'}
            </p>
        </Link>
    )
}

export default function ContinueWatching() {
    const { history, removeHistory } = useWatchHistory()
    const display = history.slice(0, 6)

    if (!display.length) return null

    return (
        <section className='px-4 sm:px-6 md:px-8 md:container md:mx-auto pt-6'>
            <h2 className='text-white font-semibold text-[18px] sm:text-[20px] mb-4'>Tiếp tục xem</h2>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
                {display.map(item => (
                    <ContinueCard key={item.slug} item={item} onRemove={removeHistory} />
                ))}
            </div>
        </section>
    )
}
