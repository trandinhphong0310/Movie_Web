import React from 'react'

export default function Footer() {
    return (
        <div className='text-white p-12 bg-[#0F111A] mt-40'>
            <div className="flex">
                <p className='leading-[25px] h-[65px] font-bold text-[46px] text-red-500 uppercase'>Movie</p>
                <ul className='flex ml-12 gap-4'>
                    <li className='bg-[#ffffff11] rounded-2xl p-2 h-8'>
                        <img className="w-5" src='https://cdn-icons-png.flaticon.com/512/59/59439.png' alt="" />
                    </li>
                    <li className='bg-[#ffffff11] rounded-2xl p-2 h-8'>
                        <img className="w-5" src='https://static.vecteezy.com/system/resources/previews/018/930/569/original/youtube-logo-youtube-icon-transparent-free-png.png' alt="" />
                    </li>
                    <li className='bg-[#ffffff11] rounded-2xl p-2 h-8'>
                        <img className="w-5" src='https://static.vecteezy.com/system/resources/previews/018/930/573/original/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png' alt="" />
                    </li>
                </ul>
            </div>
            <ul className='flex gap-4 mb-8'>
                <li>Hỏi-Đáp</li>
                <li>Chính sách bảo mật</li>
                <li>Điều khoản sử dụng</li>
                <li>Giới thiệu</li>
                <li>Liên hệ</li>
            </ul>
            <div className="w-[50%]">
                <p className='text-gray-400 mb-4'>Movie - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại. Khám phá nền tảng phim trực tuyến hay nhất 2024 chất lượng 4K!</p>
                <span className='text-[14px]'>© 2024 Movie</span>
            </div>
        </div>
    )
}
