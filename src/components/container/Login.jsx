import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../redux/services/authApi'

export default function Login() {
    const navigate = useNavigate()
    const [login, { isLoading }] = useLoginMutation()
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.username.trim() || !form.password.trim()) {
            setError('Vui lòng điền đầy đủ thông tin.')
            return
        }
        try {
            const res = await login(form).unwrap()
            const token = res.token || res.data?.token || res.access_token
            if (token) {
                localStorage.setItem('token', token)
                window.dispatchEvent(new Event('tokenChange'))
            }
            navigate('/')
        } catch (err) {
            setError(err?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
                <label className='text-gray-400 text-[13px]'>Tên đăng nhập</label>
                <input
                    name='username'
                    value={form.username}
                    onChange={handleChange}
                    placeholder='Nhập tên đăng nhập'
                    autoComplete='username'
                    className='bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-[14px]
                        focus:outline-none focus:border-red-500 transition placeholder-gray-600'
                />
            </div>
            <div className='flex flex-col gap-1.5'>
                <label className='text-gray-400 text-[13px]'>Mật khẩu</label>
                <input
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleChange}
                    placeholder='Nhập mật khẩu'
                    autoComplete='current-password'
                    className='bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-[14px]
                        focus:outline-none focus:border-red-500 transition placeholder-gray-600'
                />
            </div>

            {error && <p className='text-red-400 text-[13px]'>{error}</p>}

            <button
                type='submit'
                disabled={isLoading}
                className='bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed
                    text-white font-semibold rounded-lg py-2.5 text-[14px] transition mt-1'
            >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <p className='text-center text-gray-500 text-[13px]'>
                Chưa có tài khoản?{' '}
                <Link to='/dang-ky' className='text-red-400 hover:text-red-300 transition'>Đăng ký ngay</Link>
            </p>
        </form>
    )
}
