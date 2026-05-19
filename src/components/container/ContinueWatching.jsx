import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlay, FaTimes } from 'react-icons/fa'
import { readHistory, removeFromHistory } from '../../hooks/useWatchHistory'

const base_url = import.meta.env.VITE_BASE_IMG_URL

export default function ContinueWatching() {
    const [history, setHistory] = useState(() => readHistory())

    useEffect(() => {
        const sync = () => setHistory(readHistory())
        window.addEventListener('history_updated', sync)
        return () => window.removeEventListener('history_updated', sync)
    }, [])

    const display = history.slice(0, 6)

    if (!display.length) return null

    function handleRemove(e, slug) {
        e.preventDefault()
        e.stopPropagation()
        removeFromHistory(slug)
    }

    return (
        <section className='px-4 sm:px-6 md:px-8 md:container md:mx-auto pt-6'>
            <h2 className='text-white font-semibold text-[18px] sm:text-[20px] mb-4'>Tiếp tục xem</h2>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
                {display.map(item => (
                    <Link
                        key={item.slug}
                        to={`/xem-phim/${item.slug}?ep=${item.epName}`}
                        className='group relative'
                    >
                        <div className='relative rounded-lg overflow-hidden aspect-video bg-white/5'>
                            <img
                                src={`${base_url}/${item.thumb_url}`}
                                alt={item.name}
                                loading='lazy'
                                decoding='async'
                                className='w-full h-full object-cover'
                            />
                            {/* Play overlay */}
                            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                <div className='w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                                    <FaPlay className='text-white text-[12px] ml-0.5' />
                                </div>
                            </div>
                            {/* Episode badge */}
                            {item.epName && item.epName !== 'Full' && (
                                <span className='absolute bottom-1.5 left-1.5 text-[10px] px-1.5 py-0.5 bg-black/70 text-gray-200 rounded'>
                                    Tập {item.epName}
                                </span>
                            )}
                            {/* Remove button */}
                            <button
                                onClick={(e) => handleRemove(e, item.slug)}
                                className='absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-gray-300
                                    opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center
                                    hover:bg-red-600 hover:text-white'
                                title='Xóa khỏi lịch sử'
                            >
                                <FaTimes size={8} />
                            </button>
                        </div>
                        <p className='text-gray-300 text-[12px] mt-1.5 line-clamp-2 leading-tight group-hover:text-white transition-colors'>
                            {item.name}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    )
}
