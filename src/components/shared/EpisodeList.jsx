import { Link } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'

/**
 * Reusable episode list component.
 * Used by MoviesCard and MoviesPlay.
 */
export default function EpisodeList({ episodes = [], slug, activeEp }) {
    if (episodes.length === 0) return null

    return (
        <div>
            {/* Section header */}
            <div className='flex items-center gap-3 mb-5'>
                <span className='text-white font-bold text-[15px] tracking-wide uppercase'>Danh sách tập</span>
                <div className='flex-1 h-px bg-gradient-to-r from-red-500/60 to-transparent' />
                <span className='text-gray-500 text-[12px]'>{episodes.length} tập</span>
            </div>

            <ul className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-8'>
                {episodes.map((item, index) => {
                    const isActive = activeEp === item.name
                    return (
                        <li key={index}>
                            <Link to={`/xem-phim/${slug}?ep=${item.name}`}>
                                <div className={`
                                    relative flex items-center justify-center gap-1.5
                                    px-2 py-3 rounded-xl text-[13px] font-medium
                                    border transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-gradient-to-br from-[#FECF59] to-[#f59e0b] border-[#FECF59] text-[#1a1600] shadow-[0_0_12px_rgba(254,207,89,0.4)]'
                                        : 'bg-[#1e2130] border-white/5 text-gray-300 hover:border-red-500/50 hover:bg-[#252840] hover:text-white hover:shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                                    }
                                `}>
                                    <FaPlay className={`text-[9px] flex-shrink-0 ${isActive ? 'text-[#1a1600]' : 'text-red-400 group-hover:text-red-300'}`} />
                                    <span className='truncate'>Tập {item.name}</span>
                                    {isActive && (
                                        <span className='absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full' />
                                    )}
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
