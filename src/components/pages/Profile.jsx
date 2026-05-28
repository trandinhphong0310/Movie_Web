import { useState, useEffect, useRef } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/services/authApi'
import { readHistory } from '../../hooks/useWatchHistory'
import { useWatchlist } from '../../hooks/useWatchlist'
import { FaHistory, FaHeart, FaCalendarAlt, FaEdit, FaCheck, FaTimes, FaCamera } from 'react-icons/fa'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

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
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const fileInputRef = useRef(null)

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
    const currentAvatar = profile?.avatar

    async function handleAvatarUpload(e) {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { setUploadError('Chỉ hỗ trợ file ảnh.'); return }
        if (file.size > 5 * 1024 * 1024) { setUploadError('Ảnh tối đa 5MB.'); return }

        setUploading(true)
        setUploadError('')
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('upload_preset', UPLOAD_PRESET)

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: data }
            )
            if (!res.ok) throw new Error('Upload thất bại')
            const json = await res.json()

            await updateProfile({ avatar: json.secure_url }).unwrap()
        } catch {
            setUploadError('Upload thất bại, thử lại.')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const handleEdit = () => {
        setForm({
            fullName: profile?.fullName || '',
            email: profile?.email || '',
            phoneNumber: profile?.phoneNumber || '',
        })
        setEditing(true)
        setError('')
        setSuccess(false)
    }

    const handleCancel = () => { setEditing(false); setError('') }

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

                {/* Avatar */}
                <div className='flex flex-col items-center gap-4 mb-8'>
                    <div className='relative group'>
                        {currentAvatar ? (
                            <img
                                src={currentAvatar}
                                alt={username}
                                className='w-24 h-24 rounded-full object-cover border-2 border-white/10'
                            />
                        ) : (
                            <div className='w-24 h-24 rounded-full bg-red-600 flex items-center justify-center
                                text-white text-3xl font-bold select-none'>
                                {initials}
                            </div>
                        )}

                        {/* Upload overlay */}
                        <button
                            type='button'
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className='absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait'
                        >
                            {uploading ? (
                                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                            ) : (
                                <>
                                    <FaCamera className='text-white w-5 h-5' />
                                    <span className='text-white text-[10px] mt-1'>Đổi ảnh</span>
                                </>
                            )}
                        </button>

                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={handleAvatarUpload}
                        />
                    </div>

                    {uploadError && <p className='text-red-400 text-[12px]'>{uploadError}</p>}

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
