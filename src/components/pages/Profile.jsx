import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/services/authApi'
import { readHistory } from '../../hooks/useWatchHistory'
import { useWatchlist } from '../../hooks/useWatchlist'
import { FaHistory, FaHeart, FaCalendarAlt, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'

function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Profile() {
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    useEffect(() => {
        const handler = () => setToken(localStorage.getItem('token'))
        window.addEventListener('tokenChange', handler)
        return () => window.removeEventListener('tokenChange', handler)
    }, [])
    const { data: profile, isLoading } = useGetProfileQuery(undefined, { skip: !token })
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
    const { watchlist } = useWatchlist()
    const historyCount = readHistory().length

    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', avatar: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    if (!token) return <Navigate to='/dang-nhap' replace />

    if (isLoading) {
        return (
            <div className='min-h-screen bg-[#0a0c14] flex items-center justify-center pt-[70px]'>
                <div className='w-10 h-10 border-4 border-white/10 border-t-red-500 rounded-full animate-spin' />
            </div>
        )
    }

    const username = profile?.username || '...'
    const initials = username.slice(0, 2).toUpperCase()

    const handleEdit = () => {
        setForm({
            fullName: profile?.fullName || '',
            email: profile?.email || '',
            phoneNumber: profile?.phoneNumber || '',
            avatar: profile?.avatar || '',
        })
        setEditing(true)
        setError('')
        setSuccess(false)
    }

    const handleCancel = () => {
        setEditing(false)
        setError('')
    }

    const handleSave = async () => {
        try {
            await updateProfile(form).unwrap()
            setEditing(false)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(err?.data?.message || 'Cập nhật thất bại.')
        }
    }

    return (
        <div className='min-h-screen bg-[#0a0c14] pt-[90px] pb-16 px-4'>
            <div className='max-w-[480px] mx-auto'>

                {/* Avatar + tên */}
                <div className='flex flex-col items-center gap-4 mb-8'>
                    {profile?.avatar ? (
                        <img src={profile.avatar} alt={username}
                            className='w-20 h-20 rounded-full object-cover border-2 border-white/10' />
                    ) : (
                        <div className='w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold select-none'>
                            {initials}
                        </div>
                    )}
                    <div className='text-center'>
                        <h1 className='text-white text-2xl font-bold'>{profile?.fullName || username}</h1>
                        {profile?.fullName && <p className='text-gray-500 text-[13px]'>@{username}</p>}
                        <p className='text-gray-500 text-[13px] mt-1 flex items-center justify-center gap-1.5'>
                            <FaCalendarAlt className='w-3 h-3' />
                            Tham gia {formatDate(profile?.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <Link to='/lich-su'
                        className='bg-[#0f111a] border border-white/8 rounded-2xl p-5 flex flex-col items-center gap-2
                            hover:border-red-500/40 transition group'>
                        <FaHistory className='text-red-400 w-5 h-5 group-hover:scale-110 transition' />
                        <span className='text-white text-2xl font-bold'>{historyCount}</span>
                        <span className='text-gray-500 text-[12px]'>Đã xem</span>
                    </Link>
                    <Link to='/yeu-thich'
                        className='bg-[#0f111a] border border-white/8 rounded-2xl p-5 flex flex-col items-center gap-2
                            hover:border-pink-500/40 transition group'>
                        <FaHeart className='text-pink-400 w-5 h-5 group-hover:scale-110 transition' />
                        <span className='text-white text-2xl font-bold'>{watchlist.length}</span>
                        <span className='text-gray-500 text-[12px]'>Yêu thích</span>
                    </Link>
                </div>

                {/* Thông tin tài khoản */}
                <div className='bg-[#0f111a] border border-white/8 rounded-2xl overflow-hidden mb-4'>
                    <div className='px-5 py-3 border-b border-white/8 flex items-center justify-between'>
                        <span className='text-gray-400 text-[13px] font-medium'>Thông tin tài khoản</span>
                        {!editing && (
                            <button onClick={handleEdit}
                                className='flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition'>
                                <FaEdit className='w-3 h-3' /> Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <div className='p-5 flex flex-col gap-4'>
                            {[
                                { key: 'fullName', label: 'Họ tên', placeholder: 'Nhập họ tên' },
                                { key: 'email', label: 'Email', placeholder: 'Nhập email', type: 'email' },
                                { key: 'phoneNumber', label: 'Số điện thoại', placeholder: 'Nhập số điện thoại' },
                                { key: 'avatar', label: 'Avatar URL', placeholder: 'https://...' },
                            ].map(({ key, label, placeholder, type = 'text' }) => (
                                <div key={key} className='flex flex-col gap-1.5'>
                                    <label className='text-gray-500 text-[12px]'>{label}</label>
                                    <input
                                        type={type}
                                        value={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        placeholder={placeholder}
                                        className='bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-[14px]
                                            focus:outline-none focus:border-red-500 transition placeholder-gray-600'
                                    />
                                </div>
                            ))}

                            {error && <p className='text-red-400 text-[13px]'>{error}</p>}

                            <div className='flex gap-3 mt-1'>
                                <button onClick={handleSave} disabled={isUpdating}
                                    className='flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white
                                        rounded-lg py-2.5 text-[14px] font-medium transition flex items-center justify-center gap-2'>
                                    <FaCheck className='w-3 h-3' />
                                    {isUpdating ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button onClick={handleCancel}
                                    className='flex-1 bg-white/5 hover:bg-white/10 text-gray-300
                                        rounded-lg py-2.5 text-[14px] transition flex items-center justify-center gap-2'>
                                    <FaTimes className='w-3 h-3' />
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='divide-y divide-white/8'>
                            {[
                                { label: 'Tên đăng nhập', value: username },
                                { label: 'Họ tên', value: profile?.fullName },
                                { label: 'Email', value: profile?.email },
                                { label: 'Số điện thoại', value: profile?.phoneNumber },
                            ].map(({ label, value }) => (
                                <div key={label} className='px-5 py-3.5'>
                                    <p className='text-gray-500 text-[11px] uppercase tracking-widest mb-0.5'>{label}</p>
                                    <p className={value ? 'text-white text-[14px]' : 'text-gray-600 text-[14px] italic'}>
                                        {value || 'Chưa cập nhật'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {success && (
                    <p className='text-center text-emerald-400 text-[13px]'>Cập nhật thành công!</p>
                )}
            </div>
        </div>
    )
}
