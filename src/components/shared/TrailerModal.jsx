import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

function extractYouTubeId(url) {
    if (!url) return null
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?/\s]{11})/)
    return m ? m[1] : null
}

export default function TrailerModal({ trailerUrl, title, onClose }) {
    const videoId = extractYouTubeId(trailerUrl)

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    if (!videoId) return null

    return (
        <div
            className='fixed inset-0 z-[300] flex items-center justify-center bg-black/85 backdrop-blur-sm'
            onClick={onClose}
        >
            <div
                className='relative w-full max-w-4xl mx-4'
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className='absolute -top-10 right-0 flex items-center gap-2 text-white/70 hover:text-white transition text-sm'
                >
                    <FaTimes /> Đóng
                </button>
                <div className='aspect-video rounded-xl overflow-hidden shadow-2xl'>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        className='w-full h-full'
                        allowFullScreen
                        allow='autoplay; encrypted-media'
                        title={`Trailer - ${title}`}
                    />
                </div>
            </div>
        </div>
    )
}
