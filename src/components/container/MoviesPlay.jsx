import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useMovieDetail } from '../../hooks/useMovieDetail'
import ActorList from '../shared/ActorList'
import EpisodeList from '../shared/EpisodeList'

const base_url = import.meta.env.VITE_BASE_IMG_URL

export default function MoviesPlay() {
    const { slug } = useParams()
    const [searchParams] = useSearchParams()
    const { movies, category, episodes, actor, loading } = useMovieDetail(slug)

    const epParam = searchParams.get('ep')
    const currentEpisode = episodes.find(e => e.name === epParam) || episodes[0] || null

    if (loading || !movies) {
        return <div className='text-white text-center py-20'>Đang tải tập phim...</div>
    }

    if (!currentEpisode) {
        return <div className='text-white text-center py-20'>Không tìm thấy tập phim.</div>
    }

    return (
        <div className='container mx-auto px-4 pt-[70px] md:pt-[100px]'>
            {/* Back link */}
            <div className='mt-4 mb-3'>
                <Link to={`/phim/${slug}`}
                    className='text-white text-[15px] sm:text-[18px] hover:text-yellow-300 transition duration-300'>
                    ← Xem phim {movies.name}
                </Link>
            </div>

            {/* Video player — responsive aspect ratio */}
            <div className='mb-6 w-full aspect-video'>
                <iframe
                    src={currentEpisode.link_embed}
                    frameBorder='0'
                    allowFullScreen
                    width='100%'
                    height='100%'
                    title={`Episode ${currentEpisode.name}`}
                    className='rounded-xl'
                />
            </div>

            {/* Movie info block */}
            <div className='bg-[rgba(25,27,36,0.3)] rounded-2xl p-5 md:p-8'>
                {/* Top row: poster + meta + actors */}
                <div className='flex flex-col sm:flex-row gap-5 md:gap-8 mb-8'>

                    {/* Poster + title */}
                    <div className='flex flex-row sm:flex-col gap-4 sm:gap-0 sm:w-[180px] flex-shrink-0'>
                        <img
                            src={`${base_url}/${movies.thumb_url}`}
                            alt={movies.name}
                            className='w-[100px] sm:w-full rounded-lg'
                        />
                        <div className='sm:mt-3'>
                            <h1 className='text-white text-[18px] sm:text-[22px] md:text-[25px] leading-tight mb-1'>{movies.name}</h1>
                            <h2 className='text-[#ffd875] text-[13px]'>{movies.origin_name}</h2>
                        </div>
                    </div>

                    {/* Meta + description */}
                    <div className='flex-1 min-w-0'>
                        <ul className='flex gap-2 text-[13px] text-gray-300 mb-3 flex-wrap'>
                            <li className='border border-white px-2 py-1 rounded bg-[#ffffff10]'>{movies.year}</li>
                            <li className='border border-white px-2 py-1 rounded bg-[#ffffff10]'>{movies.episode_total}</li>
                        </ul>
                        <ul className='flex flex-wrap gap-2 text-[13px] text-gray-300 mb-4'>
                            {category.map(item => (
                                <li key={item.id} className='border border-transparent px-2 py-1 rounded bg-[#ffffff10]'>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                        <span className='text-white text-[15px]'><strong>Giới thiệu:</strong></span>
                        <div
                            className='mt-2 text-gray-400 text-[14px] leading-relaxed line-clamp-4 md:line-clamp-none'
                            dangerouslySetInnerHTML={{ __html: movies.content }}
                        />
                    </div>

                    {/* Actors — hidden on mobile, shown md+ */}
                    <div className='hidden md:block flex-shrink-0 w-[180px]'>
                        <ActorList actors={actor} limit={4} />
                    </div>
                </div>

                {/* Actors on mobile */}
                <div className='md:hidden mb-6'>
                    <ActorList actors={actor} limit={6} />
                </div>

                {/* Episodes */}
                <EpisodeList episodes={episodes} slug={slug} activeEp={epParam} />
            </div>
        </div>
    )
}
