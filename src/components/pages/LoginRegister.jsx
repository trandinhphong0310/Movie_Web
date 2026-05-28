import { useLocation, Link } from 'react-router-dom'
import Login from '../container/Login'
import Register from '../container/Register'

export default function LoginRegister() {
    const { pathname } = useLocation()
    const isLogin = pathname === '/dang-nhap'

    return (
        <div className='min-h-screen bg-[#0a0c14] flex items-center justify-center px-4 pt-[70px]'>
            <div className='w-full max-w-[400px]'>
                {/* Card */}
                <div className='bg-[#0f111a] border border-white/8 rounded-2xl p-8 shadow-2xl'>
                    {/* Tab switcher */}
                    <div className='flex mb-6 bg-white/5 rounded-lg p-1'>
                        <Link
                            to='/dang-nhap'
                            className={`flex-1 text-center py-2 rounded-md text-[14px] font-medium transition
                                ${isLogin ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to='/dang-ky'
                            className={`flex-1 text-center py-2 rounded-md text-[14px] font-medium transition
                                ${!isLogin ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Đăng ký
                        </Link>
                    </div>

                    {isLogin ? <Login /> : <Register />}
                </div>
            </div>
        </div>
    )
}
