import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaEdit, FaTrash, FaReply } from 'react-icons/fa'
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReplyToCommentMutation,
} from '../../redux/services/commentApi'
import { useGetProfileQuery } from '../../redux/services/authApi'

function StarPicker({ value, onChange, readOnly = false, size = 'md' }) {
  const [hover, setHover] = useState(0)
  const active = hover || value
  const sizeClass = size === 'sm' ? 'text-[13px]' : 'text-[20px]'

  return (
    <div className='flex gap-0.5'>
      {[2, 4, 6, 8, 10].map((score) => (
        <button
          key={score}
          type='button'
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(score)}
          onMouseEnter={() => !readOnly && setHover(score)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`${sizeClass} transition-transform ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <FaStar className={score <= active ? 'text-yellow-400' : 'text-gray-700'} />
        </button>
      ))}
    </div>
  )
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

function ReplyCard({ reply, currentUserId, slug, profile }) {
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation()

  const ownerId = reply.userId?._id ?? reply.userId
  const isOwner = !!(currentUserId && ownerId && String(ownerId) === String(currentUserId))
  const displayName =
    reply.guestName ||
    reply.userId?.username ||
    reply.userId?.fullName ||
    (isOwner ? (profile?.fullName || profile?.username) : null) ||
    'Ẩn danh'

  async function handleDelete() {
    if (!window.confirm('Xóa trả lời này?')) return
    deleteComment({ id: reply._id, slug })
  }

  return (
    <div className='flex gap-2.5'>
      <div className='w-7 h-7 rounded-full bg-red-600/25 border border-red-500/25 flex items-center justify-center
        text-red-300 font-bold text-[11px] flex-shrink-0 select-none mt-0.5'>
        {displayName[0].toUpperCase()}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 min-w-0'>
            <span className='text-gray-200 text-[12px] font-medium truncate'>{displayName}</span>
            <span className='text-gray-600 text-[11px] flex-shrink-0'>{timeAgo(reply.createdAt)}</span>
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className='p-1 text-gray-600 hover:text-red-400 transition rounded flex-shrink-0 disabled:opacity-40'
              title='Xóa'
            >
              <FaTrash size={10} />
            </button>
          )}
        </div>
        <p className='text-gray-400 text-[12px] leading-relaxed mt-0.5 whitespace-pre-wrap'>
          {reply.content}
        </p>
      </div>
    </div>
  )
}

function ReplyForm({ commentId, slug, isLoggedIn, displayUsername, onCancel }) {
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [error, setError] = useState('')
  const [replyToComment, { isLoading }] = useReplyToCommentMutation()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!content.trim()) { setError('Vui lòng nhập nội dung.'); return }
    if (!isLoggedIn && !guestName.trim()) { setError('Vui lòng nhập tên của bạn.'); return }

    const body = { slug, content: content.trim() }
    if (!isLoggedIn) body.guestName = guestName.trim()

    try {
      await replyToComment({ id: commentId, ...body }).unwrap()
      setContent('')
      setGuestName('')
      onCancel()
    } catch (err) {
      setError(err?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mt-3 pl-9'>
      {isLoggedIn ? (
        <p className='text-gray-600 text-[11px] mb-2'>
          Trả lời với tên: <span className='text-gray-400'>{displayUsername}</span>
        </p>
      ) : (
        <input
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder='Tên của bạn *'
          className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-[12px]
            mb-2 focus:outline-none focus:border-red-500 transition placeholder-gray-600'
        />
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Viết trả lời...'
        rows={2}
        autoFocus
        className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-[12px]
          resize-none focus:outline-none focus:border-red-500 transition placeholder-gray-600'
      />
      {error && <p className='text-red-400 text-[11px] mt-1'>{error}</p>}
      <div className='flex gap-2 mt-2'>
        <button
          type='submit'
          disabled={isLoading || !content.trim()}
          className='px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg
            text-[12px] font-medium transition'
        >
          {isLoading ? 'Đang gửi...' : 'Gửi'}
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-[12px] transition'
        >
          Hủy
        </button>
      </div>
    </form>
  )
}

function CommentCard({ comment, currentUserId, slug, profile, isLoggedIn, displayUsername }) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [editRating, setEditRating] = useState(comment.rating)
  const [replyOpen, setReplyOpen] = useState(false)
  const [showReplies, setShowReplies] = useState(true)

  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation()
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation()

  const ownerId = comment.userId?._id ?? comment.userId
  const isOwner = !!(currentUserId && ownerId && String(ownerId) === String(currentUserId))
  const displayName =
    comment.guestName ||
    comment.userId?.username ||
    comment.userId?.fullName ||
    (isOwner ? (profile?.fullName || profile?.username) : null) ||
    'Ẩn danh'
  const initial = displayName[0].toUpperCase()
  const replies = comment.replies || []

  async function handleUpdate() {
    if (!editContent.trim()) return
    await updateComment({ id: comment._id, slug, content: editContent.trim(), rating: editRating })
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
    setEditContent(comment.content)
    setEditRating(comment.rating)
  }

  async function handleDelete() {
    if (!window.confirm('Xóa bình luận này?')) return
    deleteComment({ id: comment._id, slug })
  }

  return (
    <div className='bg-white/[0.03] border border-white/5 rounded-xl p-4'>
      {/* Header */}
      <div className='flex items-start justify-between gap-3 mb-3'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='w-9 h-9 rounded-full bg-red-600/25 border border-red-500/25 flex items-center justify-center
            text-red-300 font-bold text-[13px] flex-shrink-0 select-none'>
            {initial}
          </div>
          <div className='min-w-0'>
            <p className='text-gray-200 text-[13px] font-medium leading-none mb-1 truncate'>{displayName}</p>
            <p className='text-gray-600 text-[11px]'>{timeAgo(comment.createdAt)}</p>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          {editing
            ? <StarPicker value={editRating} onChange={setEditRating} size='sm' />
            : <StarPicker value={comment.rating} readOnly size='sm' />
          }
          <span className='text-gray-600 text-[11px] w-7 text-right'>{editing ? editRating : comment.rating}/10</span>

          {isOwner && !editing && (
            <div className='flex gap-1 ml-1'>
              <button
                onClick={() => setEditing(true)}
                className='p-1.5 text-gray-600 hover:text-blue-400 transition rounded'
                title='Chỉnh sửa'
              >
                <FaEdit size={11} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='p-1.5 text-gray-600 hover:text-red-400 transition rounded disabled:opacity-40'
                title='Xóa'
              >
                <FaTrash size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      {editing ? (
        <>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-[13px]
              resize-none focus:outline-none focus:border-red-500 transition placeholder-gray-600'
          />
          <div className='flex gap-2 mt-2'>
            <button
              onClick={handleUpdate}
              disabled={isUpdating || !editContent.trim()}
              className='px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg
                text-[12px] font-medium transition'
            >
              {isUpdating ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              onClick={cancelEdit}
              className='px-4 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-[12px] transition'
            >
              Hủy
            </button>
          </div>
        </>
      ) : (
        <p className='text-gray-400 text-[13px] leading-relaxed whitespace-pre-wrap'>{comment.content}</p>
      )}

      {/* Footer actions */}
      {!editing && (
        <div className='flex items-center gap-3 mt-3 pt-2 border-t border-white/5'>
          <button
            onClick={() => { setReplyOpen(v => !v) }}
            className='flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-red-400 transition'
          >
            <FaReply size={10} />
            Trả lời
          </button>
          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(v => !v)}
              className='text-[12px] text-gray-500 hover:text-gray-300 transition'
            >
              {showReplies ? `Ẩn ${replies.length} trả lời` : `Xem ${replies.length} trả lời`}
            </button>
          )}
        </div>
      )}

      {/* Reply form */}
      {replyOpen && (
        <ReplyForm
          commentId={comment._id}
          slug={slug}
          isLoggedIn={isLoggedIn}
          displayUsername={displayUsername}
          onCancel={() => setReplyOpen(false)}
        />
      )}

      {/* Replies list */}
      {showReplies && replies.length > 0 && (
        <div className='mt-3 pt-3 border-t border-white/5 flex flex-col gap-3 pl-3 border-l-2 border-l-white/5'>
          {replies.map(reply => (
            <ReplyCard
              key={reply._id}
              reply={reply}
              currentUserId={currentUserId}
              slug={slug}
              profile={profile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MovieComment({ slug }) {
  const token = localStorage.getItem('token')
  const { data: profile } = useGetProfileQuery(undefined, { skip: !token })
  const { data: comments = [], isLoading } = useGetCommentsQuery(slug)
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation()

  const [content, setContent] = useState('')
  const [rating, setRating] = useState(8)
  const [guestName, setGuestName] = useState('')
  const [error, setError] = useState('')

  const isLoggedIn = !!(token && profile)
  const currentUserId = profile?._id
  const displayUsername = profile?.fullName || profile?.username

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!content.trim()) { setError('Vui lòng nhập nội dung bình luận.'); return }
    if (!isLoggedIn && !guestName.trim()) { setError('Vui lòng nhập tên của bạn.'); return }

    const body = { slug, content: content.trim(), rating }
    if (!isLoggedIn) body.guestName = guestName.trim()

    try {
      await createComment(body).unwrap()
      setContent('')
      setRating(8)
      setGuestName('')
    } catch (err) {
      setError(err?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  const sorted = [...comments].reverse()
  const totalReplies = comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)

  return (
    <div>
      <div className='flex items-center gap-3 mb-5'>
        <h3 className='text-white font-semibold text-[16px]'>Bình luận</h3>
        {comments.length > 0 && (
          <span className='px-2 py-0.5 bg-red-600/20 text-red-400 text-[12px] rounded-full border border-red-500/20'>
            {comments.length + totalReplies}
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-5'>
        {isLoggedIn ? (
          <p className='text-gray-500 text-[12px] mb-3'>
            Bình luận với tên: <span className='text-gray-300'>{displayUsername}</span>
          </p>
        ) : (
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder='Tên của bạn *'
            className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5
              text-[13px] mb-3 focus:outline-none focus:border-red-500 transition placeholder-gray-600'
          />
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Viết bình luận của bạn...'
          rows={3}
          className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5
            text-[13px] resize-none focus:outline-none focus:border-red-500 transition placeholder-gray-600'
        />

        <div className='flex items-center justify-between mt-3 flex-wrap gap-3'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500 text-[12px]'>Đánh giá:</span>
            <StarPicker value={rating} onChange={setRating} />
            <span className='text-gray-500 text-[12px]'>{rating}/10</span>
          </div>
          <button
            type='submit'
            disabled={isCreating}
            className='w-full sm:w-auto px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg
              text-[13px] font-semibold transition'
          >
            {isCreating ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </div>

        {!isLoggedIn && (
          <p className='text-gray-600 text-[11px] mt-2'>
            <Link to='/dang-nhap' className='text-red-400 hover:text-red-300 transition'>Đăng nhập</Link>
            {' '}để có thể chỉnh sửa hoặc xóa bình luận của bạn.
          </p>
        )}

        {error && <p className='text-red-400 text-[12px] mt-2'>{error}</p>}
      </form>

      {/* List */}
      {isLoading ? (
        <div className='flex justify-center py-10'>
          <div className='w-6 h-6 border-2 border-white/20 border-t-red-500 rounded-full animate-spin' />
        </div>
      ) : sorted.length === 0 ? (
        <p className='text-center text-gray-600 text-[13px] py-8'>
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className='flex flex-col gap-3'>
          {sorted.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              slug={slug}
              profile={profile}
              isLoggedIn={isLoggedIn}
              displayUsername={displayUsername}
            />
          ))}
        </div>
      )}
    </div>
  )
}
