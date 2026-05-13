import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGetMoviesGenreQuery, useGetMoviesCountryQuery } from '../../redux/services/movieApi'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 25 }, (_, i) => CURRENT_YEAR - i)

const SORT_OPTIONS = [
    { value: 'modified.time|desc',     label: 'Mới cập nhật' },
    { value: 'year|desc',              label: 'Năm mới nhất' },
    { value: 'year|asc',               label: 'Năm cũ nhất' },
    { value: 'view|desc',              label: 'Xem nhiều nhất' },
    { value: 'tmdb.vote_average|desc', label: 'Đánh giá cao nhất' },
    { value: 'episode_current|desc',   label: 'Dài nhất' },
    { value: 'episode_current|asc',    label: 'Ngắn nhất' },
]

const TYPES = [
    { slug: 'phim-bo',        label: 'Phim bộ' },
    { slug: 'phim-le',        label: 'Phim lẻ' },
    { slug: 'phim-hoat-hinh', label: 'Hoạt hình' },
]

// ── Desktop select dropdown ──
function Select({ label, value, onChange, options, valueKey = 'value', labelKey = 'label' }) {
    return (
        <div className='relative'>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className='bg-[#1a1d2e] text-[13px] px-3 py-2 pr-8 rounded-lg border border-white/10 focus:outline-none focus:border-red-500/60 cursor-pointer appearance-none min-w-[120px] max-w-[160px] truncate transition-colors'
                style={{ color: value ? '#fff' : '#9ca3af' }}
            >
                <option value=''>{label}</option>
                {options.map(o => (
                    <option key={o[valueKey] ?? o} value={o[valueKey] ?? o}>
                        {o[labelKey] ?? o}
                    </option>
                ))}
            </select>
            <span className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-[9px]'>▼</span>
        </div>
    )
}

// ── Chip (active filter tag) ──
function Chip({ label, onRemove, color = 'white' }) {
    const cls = color === 'blue'
        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
        : 'bg-white/10 border-white/15 text-gray-300'
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-md border ${cls}`}>
            {label}
            <button onClick={onRemove} className='opacity-60 hover:opacity-100 ml-0.5 transition-opacity'>✕</button>
        </span>
    )
}

// ── Mobile section title ──
function SheetSection({ title, children }) {
    return (
        <div className='mb-5'>
            <p className='text-gray-400 text-[11px] uppercase tracking-widest mb-2.5 font-semibold'>{title}</p>
            {children}
        </div>
    )
}

// ── Mobile pill chip ──
function Pill({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-[13px] rounded-lg border transition-all whitespace-nowrap ${
                active
                    ? 'bg-red-600 border-red-500 text-white font-medium'
                    : 'bg-white/5 border-white/10 text-gray-300 active:bg-white/15'
            }`}
        >
            {label}
        </button>
    )
}

// ──────────────────────────────────────────────
// pageType: 'danh-sach' | 'the-loai' | 'quoc-gia'
// ──────────────────────────────────────────────
export default function FilterBar({ pageType, currentSlug }) {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [sheetOpen, setSheetOpen] = useState(false)

    const { data: genres    = [] } = useGetMoviesGenreQuery()
    const { data: countries = [] } = useGetMoviesCountryQuery()

    const selectedCountry  = searchParams.get('country')  || ''
    const selectedCategory = searchParams.get('category') || ''
    const selectedYear     = searchParams.get('year')     || ''
    const selectedSort     = searchParams.get('sort')     || ''

    const activeFiltersCount = [selectedCountry, selectedCategory, selectedYear].filter(Boolean).length

    // Lock body scroll when sheet is open
    useEffect(() => {
        document.body.style.overflow = sheetOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [sheetOpen])

    const updateParam = (key, value) => {
        const next = Object.fromEntries(searchParams)
        if (value) next[key] = value
        else delete next[key]
        next.page = 1
        setSearchParams(next)
    }

    const clearFilters = () => {
        const next = { page: 1, limit: searchParams.get('limit') || 24 }
        if (selectedSort) next.sort = selectedSort
        setSearchParams(next)
    }

    const clearAll = () => {
        setSearchParams({ page: 1, limit: searchParams.get('limit') || 24 })
        setSheetOpen(false)
    }

    const countryName  = countries.find(c => c.slug === selectedCountry)?.name
    const categoryName = genres.find(g => g.slug === selectedCategory)?.name
    const sortLabel    = SORT_OPTIONS.find(o => o.value === selectedSort)?.label

    const typePills = (
        <div className='flex items-center gap-1.5 flex-wrap'>
            {TYPES.map(({ slug, label }) => (
                <button
                    key={slug}
                    onClick={() => navigate(`/danh-sach/${slug}?page=1&limit=24`)}
                    className={`px-4 py-1.5 text-[13px] rounded-lg border transition-all font-medium ${
                        pageType === 'danh-sach' && currentSlug === slug
                            ? 'bg-red-600 border-red-500 text-white shadow-sm shadow-red-900/40'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/25'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    )

    const activeChips = (countryName || categoryName || selectedYear || sortLabel) && (
        <div className='flex flex-wrap items-center gap-1.5'>
            <span className='text-gray-500 text-[11px] uppercase tracking-wide mr-1'>Đang lọc:</span>
            {countryName  && <Chip label={countryName}  onRemove={() => updateParam('country', '')} />}
            {categoryName && <Chip label={categoryName} onRemove={() => updateParam('category', '')} />}
            {selectedYear && <Chip label={selectedYear} onRemove={() => updateParam('year', '')} />}
            {sortLabel && selectedSort && <Chip label={sortLabel} onRemove={() => updateParam('sort', '')} color='blue' />}
        </div>
    )

    return (
        <>
            {/* ═══════════════ DESKTOP (md+) ═══════════════ */}
            <div className='hidden md:block space-y-3 pb-4'>
                {typePills}

                <div className='flex flex-wrap items-center gap-2'>
                    {pageType !== 'quoc-gia' && (
                        <Select label='Quốc gia' value={selectedCountry}
                            onChange={v => updateParam('country', v)}
                            options={countries} valueKey='slug' labelKey='name' />
                    )}
                    {pageType !== 'the-loai' && (
                        <Select label='Thể loại' value={selectedCategory}
                            onChange={v => updateParam('category', v)}
                            options={genres} valueKey='slug' labelKey='name' />
                    )}
                    <Select label='Năm' value={selectedYear}
                        onChange={v => updateParam('year', v)}
                        options={YEARS.map(y => ({ value: String(y), label: String(y) }))} />
                    <Select label='Sắp xếp' value={selectedSort}
                        onChange={v => updateParam('sort', v)}
                        options={SORT_OPTIONS} />

                    {activeFiltersCount > 0 && (
                        <button onClick={clearFilters}
                            className='flex items-center gap-1.5 px-3 py-2 text-[12px] text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-400/50 rounded-lg transition-all bg-red-500/5'>
                            ✕ Xóa bộ lọc
                            <span className='bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold'>
                                {activeFiltersCount}
                            </span>
                        </button>
                    )}
                </div>

                {activeChips}
            </div>

            {/* ═══════════════ MOBILE (<md) ═══════════════ */}
            <div className='md:hidden space-y-2.5 pb-3'>
                {/* Type pills + filter button row */}
                <div className='flex items-center gap-2'>
                    <div className='flex-1 overflow-x-auto scrollbar-hide'>
                        <div className='flex items-center gap-1.5 w-max'>
                            {TYPES.map(({ slug, label }) => (
                                <button
                                    key={slug}
                                    onClick={() => navigate(`/danh-sach/${slug}?page=1&limit=24`)}
                                    className={`px-3.5 py-1.5 text-[13px] rounded-lg border transition-all font-medium whitespace-nowrap ${
                                        pageType === 'danh-sach' && currentSlug === slug
                                            ? 'bg-red-600 border-red-500 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter trigger button */}
                    <button
                        onClick={() => setSheetOpen(true)}
                        className='flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-lg border border-white/15 bg-white/5 text-gray-300 active:bg-white/10 transition-colors'
                    >
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                                d='M3 4h18M6 12h12M10 20h4' />
                        </svg>
                        Bộ lọc
                        {(activeFiltersCount > 0 || selectedSort) && (
                            <span className='bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold'>
                                {activeFiltersCount + (selectedSort ? 1 : 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Active chips on mobile */}
                {activeChips}
            </div>

            {/* ═══════════════ MOBILE BOTTOM SHEET ═══════════════ */}
            {/* Backdrop */}
            <div
                onClick={() => setSheetOpen(false)}
                className={`fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity duration-300 ${
                    sheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0d0f18] rounded-t-2xl transition-transform duration-300 ease-out max-h-[88vh] flex flex-col ${
                    sheetOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                {/* Handle bar */}
                <div className='flex justify-center pt-3 pb-1 flex-shrink-0'>
                    <div className='w-10 h-1 rounded-full bg-white/20' />
                </div>

                {/* Header */}
                <div className='flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0'>
                    <span className='text-white font-semibold text-[16px]'>Bộ lọc & Sắp xếp</span>
                    <button onClick={() => setSheetOpen(false)}
                        className='w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-300 active:bg-white/20 transition-colors'>
                        ✕
                    </button>
                </div>

                {/* Scrollable content */}
                <div className='overflow-y-auto flex-1 px-5 py-4'>

                    {/* Sắp xếp */}
                    <SheetSection title='Sắp xếp theo'>
                        <div className='flex flex-wrap gap-2'>
                            <Pill label='Mặc định' active={!selectedSort} onClick={() => updateParam('sort', '')} />
                            {SORT_OPTIONS.map(o => (
                                <Pill key={o.value} label={o.label}
                                    active={selectedSort === o.value}
                                    onClick={() => updateParam('sort', o.value)} />
                            ))}
                        </div>
                    </SheetSection>

                    {/* Quốc gia */}
                    {pageType !== 'quoc-gia' && (
                        <SheetSection title='Quốc gia'>
                            <div className='flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1'>
                                <Pill label='Tất cả' active={!selectedCountry} onClick={() => updateParam('country', '')} />
                                {countries.map(c => (
                                    <Pill key={c._id} label={c.name}
                                        active={selectedCountry === c.slug}
                                        onClick={() => updateParam('country', c.slug)} />
                                ))}
                            </div>
                        </SheetSection>
                    )}

                    {/* Thể loại */}
                    {pageType !== 'the-loai' && (
                        <SheetSection title='Thể loại'>
                            <div className='flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1'>
                                <Pill label='Tất cả' active={!selectedCategory} onClick={() => updateParam('category', '')} />
                                {genres.map(g => (
                                    <Pill key={g._id} label={g.name}
                                        active={selectedCategory === g.slug}
                                        onClick={() => updateParam('category', g.slug)} />
                                ))}
                            </div>
                        </SheetSection>
                    )}

                    {/* Năm */}
                    <SheetSection title='Năm phát hành'>
                        <div className='flex flex-wrap gap-2 max-h-[130px] overflow-y-auto pr-1'>
                            <Pill label='Tất cả' active={!selectedYear} onClick={() => updateParam('year', '')} />
                            {YEARS.map(y => (
                                <Pill key={y} label={String(y)}
                                    active={selectedYear === String(y)}
                                    onClick={() => updateParam('year', String(y))} />
                            ))}
                        </div>
                    </SheetSection>
                </div>

                {/* Footer actions */}
                <div className='flex gap-3 px-5 py-4 border-t border-white/8 flex-shrink-0'>
                    <button onClick={clearAll}
                        className='flex-1 py-3 text-[14px] font-medium rounded-xl border border-white/15 text-gray-300 bg-white/5 active:bg-white/10 transition-colors'>
                        Xóa tất cả
                    </button>
                    <button onClick={() => setSheetOpen(false)}
                        className='flex-[2] py-3 text-[14px] font-semibold rounded-xl bg-red-600 text-white active:bg-red-700 transition-colors'>
                        Áp dụng {activeFiltersCount + (selectedSort ? 1 : 0) > 0 && `(${activeFiltersCount + (selectedSort ? 1 : 0)})`}
                    </button>
                </div>
            </div>
        </>
    )
}
