import { useEffect, useRef, useState } from 'react'

/**
 * Reusable pagination component.
 * Used by GenreMovie, CountryMovie, MovieListByCategory.
 */
export default function Pagination({ page, totalPage, onPrev, onNext, onGoto }) {
    const [input, setInput] = useState(String(page))
    const timer = useRef(null)

    useEffect(() => setInput(String(page)), [page])
    useEffect(() => () => clearTimeout(timer.current), [])

    const commit = (value) => {
        const next = Number(value)
        if (next >= 1 && next <= totalPage && next !== page) onGoto(next)
    }

    const handleChange = (e) => {
        const value = e.target.value
        setInput(value)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => commit(value), 600)
    }

    return (
        <div className='text-white flex justify-center items-center gap-4 pt-20 pb-10'>
            <button
                onClick={onPrev}
                disabled={page === 1}
                className='group flex justify-center items-center bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/10 hover:border-white/30 size-[48px] rounded-full cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md'
                title='Trang trước'
            >
                <i className='fa-solid fa-arrow-left text-white/80 group-hover:text-white transition-colors'></i>
            </button>
            <div className='relative group flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/30 h-[48px] px-6 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md'>
                <span className='text-white/60 text-sm font-medium mr-3 tracking-wide uppercase'>Trang</span>
                <input
                    type='number'
                    value={input}
                    min={1}
                    max={totalPage || 1}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && (clearTimeout(timer.current), commit(input))}
                    className='bg-black/20 hover:bg-black/40 focus:bg-black/60 text-white font-bold text-base w-[46px] h-[32px] rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                />
                <span className='text-white/30 mx-3 font-light text-lg'>/</span>
                <span className='text-white font-bold text-base'>{totalPage || 1}</span>
            </div>
            <button
                onClick={onNext}
                disabled={page >= totalPage}
                className='group flex justify-center items-center bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/10 hover:border-white/30 size-[48px] rounded-full cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md'
                title='Trang sau'
            >
                <i className='fa-solid fa-arrow-right text-white/80 group-hover:text-white transition-colors'></i>
            </button>
        </div>
    )
}
