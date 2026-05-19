import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center px-4 text-center'>
            <p className='text-[120px] font-black text-white/5 leading-none select-none'>404</p>
            <h1 className='text-white text-[28px] font-bold -mt-6 mb-3'>Không tìm thấy trang</h1>
            <p className='text-gray-500 text-[15px] mb-8 max-w-[360px]'>
                Trang bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Link
                to='/'
                className='px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-[15px] transition-colors'
            >
                Về trang chủ
            </Link>
        </div>
    )
}
