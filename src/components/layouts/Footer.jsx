export default function Footer() {
    return (
        <footer className='text-white px-5 sm:px-8 md:px-12 py-10 bg-[#0F111A] mt-20 md:mt-40'>
            <div className='w-full mx-auto'>
                {/* Top row */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                    <img src='/logo.svg' alt='CineHub' className='h-[42px] md:h-[50px] w-auto' />
                    <ul className='flex gap-3'>
                        <li className='bg-[#ffffff11] rounded-2xl p-2 w-8 h-8 flex items-center justify-center'>
                            <img className='w-4' src='https://cdn-icons-png.flaticon.com/512/59/59439.png' alt='Facebook' />
                        </li>
                        <li className='bg-[#ffffff11] rounded-2xl p-2 w-8 h-8 flex items-center justify-center'>
                            <img className='w-4' src='https://static.vecteezy.com/system/resources/previews/018/930/569/original/youtube-logo-youtube-icon-transparent-free-png.png' alt='YouTube' />
                        </li>
                        <li className='bg-[#ffffff11] rounded-2xl p-2 w-8 h-8 flex items-center justify-center'>
                            <img className='w-4' src='https://static.vecteezy.com/system/resources/previews/018/930/573/original/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png' alt='TikTok' />
                        </li>
                    </ul>
                </div>

                {/* Links */}
                <ul className='flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-300 mb-6'>
                    <li className='hover:text-white cursor-pointer'>Hỏi-Đáp</li>
                    <li className='hover:text-white cursor-pointer'>Chính sách bảo mật</li>
                    <li className='hover:text-white cursor-pointer'>Điều khoản sử dụng</li>
                    <li className='hover:text-white cursor-pointer'>Giới thiệu</li>
                    <li className='hover:text-white cursor-pointer'>Liên hệ</li>
                </ul>

                <hr className='border-white/10 mb-6' />

                {/* Description */}
                <p className='text-gray-400 text-[13px] leading-relaxed mb-3 max-w-2xl'>
                    CineHub - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD.
                    Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc,
                    Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại.
                </p>
                <span className='text-[13px] text-gray-500'>© 2024 CineHub</span>
            </div>
        </footer>
    )
}
