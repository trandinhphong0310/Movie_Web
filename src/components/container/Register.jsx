import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../redux/services/authApi'

export default function Register() {
    const navigate = useNavigate()
    const [register, { isLoading }] = useRegisterMutation()
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.username.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
            setError('Vui lòng điền đầy đủ thông tin.')
            return
        }
        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.')
            return
        }
        try {
            await register(form).unwrap()
            navigate('/dang-nhap')
        } catch (err) {
            setError(err?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.')
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
                    autoComplete='new-password'
                    className='bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-[14px]
                        focus:outline-none focus:border-red-500 transition placeholder-gray-600'
                />
            </div>
            <div className='flex flex-col gap-1.5'>
                <label className='text-gray-400 text-[13px]'>Xác nhận mật khẩu</label>
                <input
                    name='confirmPassword'
                    type='password'
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder='Nhập lại mật khẩu'
                    autoComplete='new-password'
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
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            <p className='text-center text-gray-500 text-[13px]'>
                Đã có tài khoản?{' '}
                <Link to='/dang-nhap' className='text-red-400 hover:text-red-300 transition'>Đăng nhập</Link>
            </p>
        </form>
    )
}
