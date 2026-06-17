import { forwardRef, useEffect, useRef } from 'react'
import Hls from 'hls.js'

/**
 * Player HLS tự build bằng hls.js.
 * Cho phép bắt sự kiện kết thúc phim / tiến độ — điều mà iframe embed không làm được.
 *
 * Props:
 *  - src: link .m3u8
 *  - startTime: giây cần tua tới khi mở (resume)
 *  - onEnded: callback khi hết tập
 *  - onTimeUpdate: (current, duration) => void  — gọi liên tục khi đang phát
 *  - className, title, poster
 *
 * Ref được forward tới thẻ <video> (để MoviesPlay gọi requestFullscreen).
 */
const VideoPlayer = forwardRef(function VideoPlayer(
  { src, startTime = 0, onEnded, onTimeUpdate, className, title, poster },
  ref
) {
  const videoRef = useRef(null)
  const startTimeRef = useRef(startTime)
  startTimeRef.current = startTime

  // Forward ref nội bộ ra ngoài
  useEffect(() => {
    if (!ref) return
    if (typeof ref === 'function') ref(videoRef.current)
    else ref.current = videoRef.current
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    let hls

    const seekToStart = () => {
      if (startTimeRef.current > 0) {
        try { video.currentTime = startTimeRef.current } catch { /* ignore */ }
      }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari / iOS phát HLS native
      video.src = src
      video.addEventListener('loadedmetadata', seekToStart, { once: true })
    } else if (Hls.isSupported()) {
      hls = new Hls({ maxBufferLength: 30, enableWorker: true })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        seekToStart()
        video.play().catch(() => { /* autoplay có thể bị chặn */ })
      })
    } else {
      // Trình duyệt quá cũ — thử gán trực tiếp
      video.src = src
      video.addEventListener('loadedmetadata', seekToStart, { once: true })
    }

    return () => {
      hls?.destroy()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      title={title}
      poster={poster}
      controls
      autoPlay
      playsInline
      onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime, e.currentTarget.duration)}
      onEnded={onEnded}
    />
  )
})

export default VideoPlayer
