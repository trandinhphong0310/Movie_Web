import { useEffect, useState } from 'react'
import { getMoviesBySlugCategory } from '../../api/phim_api'
import { Link } from 'react-router-dom'
import MovieItemCard from '../shared/MovieItemCard'

export default function MovieSection({ slug }) {
    const [movies, setMovies] = useState([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        getMoviesBySlugCategory(slug)
            .then(data => {
                if (data) {
                    setMovies(data.items)
                    setTitle(data.breadCrumb?.[0]?.name || '')
                }
            })
    }, [slug])

    return (
        <>
            <div className='header-movies'>
                <h2 className='title-category'>{title}</h2>
                <button className='text-white'>
                    <Link to={`/danh-sach/${slug}?page=1&limit=24`}>Xem toàn bộ</Link>
                </button>
            </div>
            <div className='movies-card overflow-x-auto pb-2 scrollbar-hide'>
                {movies.slice(0, 5).map(item => (
                    <MovieItemCard key={item._id} item={item} layout='section' />
                ))}
            </div>
        </>
    )
}
