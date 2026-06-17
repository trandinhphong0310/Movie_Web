// Lưu tiến độ xem từng tập vào localStorage để "Xem tiếp" (resume) như Netflix.
// Key theo cặp slug + tên tập. Mỗi entry: { t: giây đang xem, d: tổng thời lượng, at: timestamp }

const KEY = 'cinehub_progress'
const MAX_ENTRIES = 200          // tránh phình localStorage
const MIN_SAVE_SECONDS = 5       // chỉ lưu khi đã xem quá 5s
const NEAR_END_SECONDS = 30      // còn <=30s coi như đã xem xong → không resume

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
  catch { return {} }
}

function writeAll(map) {
  // Giới hạn số entry: giữ lại các entry mới nhất theo `at`
  const keys = Object.keys(map)
  if (keys.length > MAX_ENTRIES) {
    keys
      .sort((a, b) => (map[a].at || 0) - (map[b].at || 0))
      .slice(0, keys.length - MAX_ENTRIES)
      .forEach(k => delete map[k])
  }
  localStorage.setItem(KEY, JSON.stringify(map))
}

function makeKey(slug, epName) {
  return `${slug}::${epName ?? ''}`
}

/** Lấy số giây nên tua tới khi mở lại tập. Trả 0 nếu không có/không hợp lệ. */
export function getResumeTime(slug, epName) {
  const entry = readAll()[makeKey(slug, epName)]
  if (!entry) return 0
  const { t, d } = entry
  if (!t || t < MIN_SAVE_SECONDS) return 0
  // Đã gần hết phim thì bắt đầu lại từ đầu
  if (d && d - t <= NEAR_END_SECONDS) return 0
  return t
}

/** Lưu tiến độ. Tự xoá khi đã xem gần hết để lần sau không tua tới cuối. */
export function saveProgress(slug, epName, current, duration) {
  if (!slug || !duration) return
  const map = readAll()
  const k = makeKey(slug, epName)
  if (duration - current <= NEAR_END_SECONDS || current < MIN_SAVE_SECONDS) {
    delete map[k]
  } else {
    map[k] = { t: current, d: duration, at: Date.now() }
  }
  writeAll(map)
}

/** Xoá tiến độ của một tập (gọi khi tập kết thúc). */
export function clearProgress(slug, epName) {
  const map = readAll()
  delete map[makeKey(slug, epName)]
  writeAll(map)
}
