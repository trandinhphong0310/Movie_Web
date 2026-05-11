import { Link } from 'react-router-dom'

const base_url = import.meta.env.VITE_BASE_IMG_URL

/**
 * Reusable movie card (thumbnail + info) used by MovieGrid, SearchResults, etc.
 * Supports two layouts:
 *  - "grid"    : thumbnail (portrait) + info block below (default)
 *  - "section" : poster image only with badges overlay + name below (used in HomeSection)
 */
export default function MovieItemCard({ item, layout = 'grid' }) {
    if (!item) return null

    if (layout === 'section') {
        return (
            <div className='movies-card_item'>
                <Link to={`/phim/${item.slug}`}>
                    <div className='relative'>
                        <img src={`${base_url}/${item.thumb_url}`} alt={item.name}
                            loading='lazy' decoding='async'
                            className='w-full rounded-lg aspect-[2/3] md:aspect-video md:object-cover' />
                        <div className="absolute bottom-0 left-2 flex gap-1">
                            <span className='movies-card_lang'>{item.lang === 'Vietsub' ? 'P.Đề' : 'Ko P.Đề'}</span>
                            <span className='movies-card_episode'>{item.episode_current}</span>
                        </div>
                    </div>
                    <h3 className='movies-card_name mt-2 text-[15px]'>{item.name}</h3>
                    <h4 className='text-[12px] text-[#aaaaaa] line-clamp-1'>{item.origin_name}</h4>
                </Link>
            </div>
        )
    }

    // default "grid" layout
    return (
        <div className='mt-4 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'>
            <Link to={`/phim/${item.slug}`}>
                <img
                    loading='lazy'
                    decoding='async'
                    className='w-full aspect-[2/3] object-cover rounded-lg'
                    src={`${base_url}/${item.thumb_url}`}
                    alt={item.name}
                />
                <div className='bg-[#221f1f] p-[16px] rounded-md flex flex-col h-60 relative'>
                    <h3 className='text-white text-[20px] line-clamp-2'>{item.name}</h3>
                    <h4 className='text-[14px] text-[#aaaaaa] mt-4 mb-2'>{item.origin_name}</h4>
                    <p className='movies-card_time'>{item.time}</p>
                    <p className='movies-card_year'>{item.year}</p>
                    <div className='movies-card-lang_episode'>
                        <span className='movies-card_lang'>{item.lang === 'Vietsub' ? 'P.Đề' : 'Ko P.Đề'}</span>
                        <span className='movies-card_episode'>{item.episode_current}</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}
