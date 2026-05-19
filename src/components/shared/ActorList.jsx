/**
 * Reusable actor list component.
 * Used by MoviesCard and MoviesPlay.
 */
export default function ActorList({ actors = [], limit = 6 }) {
    const actor_img_url = import.meta.env.VITE_ACTOR_IMG_URL
    const display = actors.filter(a => a.profile_path).slice(0, limit)

    if (!display.length) return null

    return (
        <div>
            <p className='text-[11px] text-gray-500 uppercase tracking-wider mb-3'>Diễn viên</p>
            <div className='flex gap-3 flex-wrap'>
                {display.map((item, index) => (
                    <div key={index} className='flex flex-col items-center w-[60px] group'>
                        <div className='w-[56px] h-[56px] rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500/60 transition-colors'>
                            <img
                                src={`${actor_img_url}${item.profile_path}`}
                                alt={item.name}
                                loading='lazy'
                                decoding='async'
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <span className='text-gray-400 text-[10px] text-center line-clamp-2 mt-1.5 group-hover:text-white transition-colors'>
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
