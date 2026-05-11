import { useEffect, useRef, useState } from 'react'
import { FaSearch, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa'
import { getMoviesCountry, getMoviesGenre, searchMoviesByKeyWords } from '../../api/phim_api'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const [genre, setGenre] = useState([])
  const [country, setCountry] = useState([])
  const [scroll, setScrolled] = useState(false)
  const [searchMovies, setSearchMovies] = useState([])
  const [keywords, setKeywords] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const base_url = import.meta.env.VITE_BASE_IMG_URL
  const searchRef = useRef(null)

  // Search realtime
  useEffect(() => {
    if (!keywords.trim()) { setSearchMovies([]); return }
    searchMoviesByKeyWords(keywords).then(data => {
      if (data) setSearchMovies(data.items)
    })
  }, [keywords])

  // Fetch genre + country
  useEffect(() => {
    getMoviesGenre().then(items => { if (items) setGenre(items) })
    getMoviesCountry().then(items => { if (items) setCountry(items) })
  }, [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchMovies([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (keywords.trim()) {
      navigate(`/tim-kiem?keyword=${keywords}`)
      setSearchMovies([])
      setKeywords('')
      setMenuOpen(false)
      setSearchOpen(false)
    }
  }

  const closeAll = () => {
    setMenuOpen(false)
    setGenreOpen(false)
    setCountryOpen(false)
  }

  return (
    <header className={`flex items-center justify-between px-4 md:px-10 lg:px-16 z-50 w-full fixed transition-all duration-300 ease-in-out
      ${scroll ? 'bg-[#0f111a] h-[60px] md:h-[70px]' : 'bg-[rgba(34,34,34,0.6)] h-[70px] md:h-[90px]'}`}>

      <Link to="/" onClick={closeAll} className={`flex items-center gap-2 flex-shrink-0 ${searchOpen ? 'hidden' : 'block'}`}>
        <img src='/logo.svg' alt='CineHub' className='h-[40px] md:h-[46px] w-auto' />
      </Link>

      {/* Desktop Nav */}
      <ul className={`hidden md:flex gap-5 lg:gap-7 items-center ${searchOpen ? 'hidden' : 'block'}`}>
        <li className='text-white text-[14px]'>
          <Link to="/">Trang chủ</Link>
        </li>

        {/* Thể loại dropdown */}
        <li className='text-white text-[14px] group cursor-pointer relative inline-flex items-center gap-1'>
          Thể loại <FaChevronDown className='w-[10px] h-[10px] transition-transform duration-200 group-hover:rotate-180' />
          <div className="absolute opacity-0 invisible translate-y-2
               group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
               bg-[#0f111a]/95 backdrop-blur-md
               border border-white/10 border-t-2 border-t-red-500
               rounded-b-xl w-[480px] lg:w-[640px] shadow-2xl
               left-0 top-[calc(100%+20px)] z-[99] p-4 transition-all duration-200
               before:content-[''] before:absolute before:top-[-20px] before:left-0
               before:w-full before:h-[20px] before:bg-transparent">
            <ul className='flex flex-wrap gap-1'>
              {genre.map(item => (
                <li key={item._id}>
                  <Link
                    to={`/the-loai/${item.slug}?page=1&limit=24`}
                    onClick={closeAll}
                    className='block text-[13px] px-3 py-1.5 rounded-lg text-gray-300
                      hover:text-white hover:bg-red-500/15 hover:border-red-500/30
                      border border-transparent whitespace-nowrap transition-all duration-150'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>

        {/* Quốc gia dropdown */}
        <li className='text-white text-[14px] group cursor-pointer relative inline-flex items-center gap-1'>
          Quốc gia <FaChevronDown className='w-[10px] h-[10px] transition-transform duration-200 group-hover:rotate-180' />
          <div className="absolute opacity-0 invisible translate-y-2
               group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
               bg-[#0f111a]/95 backdrop-blur-md
               border border-white/10 border-t-2 border-t-red-500
               rounded-b-xl w-[480px] lg:w-[640px] shadow-2xl
               left-0 top-[calc(100%+20px)] z-[99] p-4 transition-all duration-200
               before:content-[''] before:absolute before:top-[-20px] before:left-0
               before:w-full before:h-[20px] before:bg-transparent">
            <ul className='flex flex-wrap gap-1'>
              {country.map(item => (
                <li key={item._id}>
                  <Link
                    to={`/quoc-gia/${item.slug}?page=1&limit=24`}
                    onClick={closeAll}
                    className='block text-[13px] px-3 py-1.5 rounded-lg text-gray-300
                      hover:text-white hover:bg-red-500/15 hover:border-red-500/30
                      border border-transparent whitespace-nowrap transition-all duration-150'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>

        <li className='text-white text-[14px]'>
          <Link to="/danh-sach/phim-le?page=1&limit=24">Phim Lẻ</Link>
        </li>
        <li className='text-white text-[14px]'>
          <Link to="/danh-sach/phim-bo?page=1&limit=24">Phim Bộ</Link>
        </li>
      </ul>

      {/* Desktop Search + User */}
      <div className='hidden md:flex items-center justify-end'>
        <form className='flex gap-2 items-center relative w-[200px] lg:w-[280px]' ref={searchRef} onSubmit={handleSubmit}>
          <div className='absolute left-3 pointer-events-none'>
            <FaSearch className='text-white w-3 h-3' />
          </div>
          <input
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder='Tìm kiếm phim'
            className='bg-[rgba(255,255,255,.08)] text-white pl-8 pr-2 py-2 border border-transparent rounded-xl text-sm w-full h-[40px] focus:outline-none focus:border-white'
          />
          {/* Search dropdown */}
          {searchMovies.length > 0 && (
            <ul className='absolute top-[110%] left-0 w-full bg-[#0F111A] rounded-md shadow-lg px-2 z-50'>
              {searchMovies.slice(0, 6).map(item => (
                <Link to={`/phim/${item.slug}`} key={item._id} onClick={() => { setSearchMovies([]); setKeywords('') }}>
                  <li className='flex items-center gap-3 px-2 py-3 hover:bg-white/5 cursor-pointer'>
                    <img src={`${base_url}/${item.thumb_url}`} alt={item.name}
                      loading='lazy' decoding='async'
                      className='w-9 h-13 object-cover rounded' />
                    <span className='text-white text-sm line-clamp-1'>{item.name}</span>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </form>
      </div>

      {/* Mobile: search icon + hamburger */}
      <div className={`flex md:hidden items-center gap-3 ${searchOpen ? 'hidden' : 'block'}`}>
        <button onClick={() => setSearchOpen(v => !v)} className='text-white p-1'>
          <FaSearch className='w-4 h-4' />
        </button>
        <button onClick={() => setMenuOpen(v => !v)} className='text-white p-1'>
          {menuOpen ? <FaTimes className='w-5 h-5' /> : <FaBars className='w-5 h-5' />}
        </button>
      </div>

      {/* Mobile Search bar (toggle) — overlays the header bar */}
      {searchOpen && (
        <form onSubmit={handleSubmit} ref={searchRef}
          className='absolute inset-0 flex items-center gap-2 px-4 bg-[#0f111a] md:hidden z-50'>
          {/* Search icon */}
          <div className='flex-shrink-0'>
            <FaSearch className='text-white w-4 h-4' />
          </div>

          {/* Input */}
          <div className='flex-1'>
            <input
              autoFocus
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder='Tìm kiếm phim...'
              className='bg-transparent text-white text-sm w-full focus:outline-none placeholder-gray-400'
            />
            {/* Search dropdown */}
            {searchMovies.length > 0 && (
              <div className='absolute top-full left-0 w-full bg-[#0f111a]/95 backdrop-blur-md
                border-t-2 border-t-red-500 shadow-2xl'>
                <ul>
                  {searchMovies.slice(0, 6).map(item => (
                    <Link to={`/phim/${item.slug}`} key={item._id}
                      onClick={() => { setSearchMovies([]); setKeywords(''); setSearchOpen(false) }}>
                      <li className='flex items-center gap-4 px-4 py-3 border-b border-white/5
                        hover:bg-white/5 active:bg-white/10 cursor-pointer transition-colors'>
                        {/* Thumbnail */}
                        <div className='flex-shrink-0 relative'>
                          <img
                            src={`${base_url}/${item.thumb_url}`}
                            alt={item.name}
                            className='w-14 h-20 object-cover rounded-lg'
                          />
                          <span className='absolute bottom-1 left-1 text-[9px] px-1 py-0.5 bg-red-500 text-white rounded font-medium'>
                            {item.quality || 'HD'}
                          </span>
                        </div>
                        {/* Info */}
                        <div className='flex-1 min-w-0'>
                          <p className='text-white text-[14px] font-medium line-clamp-1'>{item.name}</p>
                          <p className='text-gray-400 text-[12px] line-clamp-1 mt-0.5'>{item.origin_name}</p>
                          <div className='flex items-center gap-2 mt-1.5'>
                            {item.year && <span className='text-[11px] text-gray-500'>{item.year}</span>}
                            {item.episode_current && (
                              <span className='text-[11px] px-1.5 py-0.5 bg-white/10 text-gray-300 rounded'>
                                {item.episode_current}
                              </span>
                            )}
                            {item.lang === 'Vietsub' && (
                              <span className='text-[11px] px-1.5 py-0.5 bg-emerald-900/60 text-emerald-400 rounded'>P.Đề</span>
                            )}
                          </div>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
                {/* Footer link */}
                <button
                  type='submit'
                  className='w-full py-3 text-[13px] text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-center font-medium'
                >
                  Xem tất cả kết quả cho "{keywords}" →
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <button type='button' onClick={() => { setSearchOpen(false); setSearchMovies([]); setKeywords('') }}
            className='flex-shrink-0 text-white p-1 hover:text-red-400 transition'>
            <FaTimes className='w-5 h-5' />
          </button>
        </form>
      )}



      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <nav className='absolute top-full left-0 w-full bg-[#0f111a] md:hidden z-40 shadow-xl'>
          <ul className='flex flex-col divide-y divide-white/10'>
            <li className='px-6 py-4 text-white text-[15px]'>
              <Link to="/" onClick={closeAll}>Trang chủ</Link>
            </li>

            {/* Mobile Thể loại */}
            <li className='px-6 py-4'>
              <button
                onClick={() => setGenreOpen(v => !v)}
                className='flex items-center justify-between w-full text-white text-[15px]'
              >
                Thể loại <FaChevronDown className={`transition-transform ${genreOpen ? 'rotate-180' : ''}`} />
              </button>
              {genreOpen && (
                <ul className='mt-3 grid grid-cols-3 gap-2'>
                  {genre.map(item => (
                    <li key={item._id} className='text-gray-300 text-[13px] py-1 hover:text-red-400'>
                      <Link to={`/the-loai/${item.slug}?page=1&limit=24`} onClick={closeAll}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Mobile Quốc gia */}
            <li className='px-6 py-4'>
              <button
                onClick={() => setCountryOpen(v => !v)}
                className='flex items-center justify-between w-full text-white text-[15px]'
              >
                Quốc gia <FaChevronDown className={`transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
              </button>
              {countryOpen && (
                <ul className='mt-3 grid grid-cols-3 gap-2'>
                  {country.map(item => (
                    <li key={item._id} className='text-gray-300 text-[13px] py-1 hover:text-red-400'>
                      <Link to={`/quoc-gia/${item.slug}?page=1&limit=24`} onClick={closeAll}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className='px-6 py-4 text-white text-[15px]'>
              <Link to="/danh-sach/phim-le?page=1&limit=24" onClick={closeAll}>Phim Lẻ</Link>
            </li>
            <li className='px-6 py-4 text-white text-[15px]'>
              <Link to="/danh-sach/phim-bo?page=1&limit=24" onClick={closeAll}>Phim Bộ</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
