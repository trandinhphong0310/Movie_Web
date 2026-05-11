/**
 * Reusable pagination component.
 * Used by GenreMovie, CountryMovie, MovieListByCategory.
 */
export default function Pagination({ page, totalPage, onPrev, onNext }) {
    return (
        <div className='text-white flex justify-center gap-4 pt-20'>
            <button
                onClick={onPrev}
                disabled={page === 1}
                className='bg-[#2f3346] size-[50px] rounded-3xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
            >
                <i className='fa-solid fa-arrow-left'></i>
            </button>
            <span className='bg-[#2f3346] w-[160px] h-[50px] rounded-xl flex items-center justify-center'>
                Trang {page} / {totalPage || 1}
            </span>
            <button
                onClick={onNext}
                disabled={page >= totalPage}
                className='bg-[#2f3346] size-[50px] rounded-3xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
            >
                <i className='fa-solid fa-arrow-right'></i>
            </button>
        </div>
    )
}
