import { useEffect, useRef, useState, useCallback } from 'react'
import { FaSearch, FaChevronDown, FaBars, FaUser, FaTimes, FaMicrophone, FaHeart, FaHistory } from 'react-icons/fa'
import { useGetMoviesGenreQuery, useGetMoviesCountryQuery, useSearchMoviesByKeyWordsQuery } from '../../redux/services/movieApi'
import { useGetProfileQuery } from '../../redux/services/authApi'
import { Link, useNavigate } from 'react-router-dom'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

function useVoiceSearch(onResult) {
  const [listening, setListening] = useState(false)
  const recogRef = useRef(null)

  const start = useCallback(() => {
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.lang = 'vi-VN'
    rec.interimResults = false
    rec.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false) }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recogRef.current = rec
    rec.start()
    setListening(true)
  }, [onResult])

  const stop = useCallback(() => {
    recogRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, start, stop, supported: !!SpeechRecognition }
}

export default function Header() {
  const { data: genre = [] } = useGetMoviesGenreQuery()
  const { data: country = [] } = useGetMoviesCountryQuery()
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

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token'))
    window.addEventListener('tokenChange', handler)
    return () => window.removeEventListener('tokenChange', handler)
  }, [])
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef(null)

  const { data: profile } = useGetProfileQuery(undefined, { skip: !token })

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUserOpen(false)
    setMenuOpen(false)
    window.dispatchEvent(new Event('tokenChange'))
    navigate('/')
  }

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const { data: searchData } = useSearchMoviesByKeyWordsQuery(keywords, { skip: !keywords.trim() })

  const { listening, start: startVoice, stop: stopVoice, supported: voiceSupported } = useVoiceSearch((transcript) => {
    setKeywords(transcript)
  })

  useEffect(() => {
    if (!keywords.trim()) {
      setSearchMovies([])
    } else if (searchData?.items) {
      setSearchMovies(searchData.items)
    }
  }, [searchData, keywords])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <ul className={`hidden md:flex gap-5 lg:gap-7 items-center ${searchOpen ? 'hidden' : 'flex'}`}>
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
              {genre
                .filter(item => item.name !== 'Phim 18+')
                .map(item => (
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

      {/* Desktop right: search + icons */}
      <div className={`hidden md:flex items-center gap-3 ${searchOpen ? 'hidden' : 'flex'}`}>
        {/* Watchlist icon */}
        <Link to="/yeu-thich" title="Yêu thích"
          className='text-gray-400 hover:text-pink-400 transition p-1'>
          <FaHeart className='w-4 h-4' />
        </Link>

        {/* History icon */}
        <Link to="/lich-su" title="Lịch sử xem"
          className='text-gray-400 hover:text-white transition p-1'>
          <FaHistory className='w-4 h-4' />
        </Link>

        {/* Search form */}
        <form className='flex gap-2 items-center relative w-[200px] lg:w-[280px]' ref={searchRef} onSubmit={handleSubmit}>
          <div className='absolute left-3 pointer-events-none'>
            <FaSearch className='text-white w-3 h-3' />
          </div>
          <input
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder='Tìm kiếm phim'
            className='bg-[rgba(255,255,255,.08)] text-white pl-8 pr-8 py-2 border border-transparent rounded-xl text-base w-full h-[40px] focus:outline-none focus:border-white'
          />
          {/* Voice search button */}
          {voiceSupported && (
            <button
              type='button'
              onClick={listening ? stopVoice : startVoice}
              className={`absolute right-2 p-1 rounded transition ${listening ? 'text-red-400 animate-pulse' : 'text-gray-400 hover:text-white'}`}
              title={listening ? 'Dừng nghe' : 'Tìm kiếm bằng giọng nói'}
            >
              <FaMicrophone className='w-3.5 h-3.5' />
            </button>
          )}
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

        {/* User */}
        {token ? (
          <div className='relative pl-2' ref={userRef}>
            <button onClick={() => setUserOpen(v => !v)}
              className='text-white hover:text-red-400 transition'>
              <FaUser className='w-4 h-4' />
            </button>
            {userOpen && (
              <div className='absolute right-0 top-[calc(100%+10px)] w-44 bg-[#0f111a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]'>
                <Link to='/ho-so' onClick={() => setUserOpen(false)}
                  className='px-4 py-3 border-b border-white/10 hover:bg-white/5 transition block'>
                  <p className='text-white text-[13px] font-medium truncate'>{profile?.username || profile?.data?.username || 'Tài khoản'}</p>
                  <p className='text-gray-500 text-[11px] mt-0.5'>Xem hồ sơ</p>
                </Link>
                <button onClick={handleLogout}
                  className='w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 text-[13px] transition'>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/dang-nhap" title="Đăng nhập"
            className='text-red-700 hover:text-white transition pl-2'>
            <FaUser className='w-4 h-4' />
          </Link>
        )}

      </div>

      {/* Mobile: search icon + hamburger */}
      <div className={`flex md:hidden items-center gap-3 ${searchOpen ? 'hidden' : 'flex'}`}>
        <Link to="/yeu-thich" className='text-gray-400 hover:text-pink-400 transition p-1'>
          <FaHeart className='w-4 h-4' />
        </Link>
        <Link to="/lich-su" className='text-gray-400 hover:text-white transition p-1'>
          <FaHistory className='w-4 h-4' />
        </Link>
        <button onClick={() => setSearchOpen(v => !v)} className='text-white p-1'>
          <FaSearch className='w-4 h-4' />
        </button>
        <button onClick={() => setMenuOpen(v => !v)} className='text-white p-1'>
          {menuOpen ? <FaTimes className='w-5 h-5' /> : <FaBars className='w-5 h-5' />}
        </button>
      </div>

      {/* Mobile Search bar */}
      {searchOpen && (
        <form onSubmit={handleSubmit} ref={searchRef}
          className='absolute inset-0 flex items-center gap-2 px-4 bg-[#0f111a] md:hidden z-50'>
          <div className='flex-shrink-0'>
            <FaSearch className='text-white w-4 h-4' />
          </div>
          <div className='flex-1 relative'>
            <input
              autoFocus
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder='Tìm kiếm phim...'
              className='bg-transparent text-white text-base w-full focus:outline-none placeholder-gray-400 pr-8'
            />
            {voiceSupported && (
              <button
                type='button'
                onClick={listening ? stopVoice : startVoice}
                className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded transition ${listening ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}
              >
                <FaMicrophone className='w-4 h-4' />
              </button>
            )}
            {searchMovies.length > 0 && (
              <div className='absolute top-full left-0 w-full bg-[#0f111a]/95 backdrop-blur-md
                border-t-2 border-t-red-500 shadow-2xl'>
                <ul>
                  {searchMovies.slice(0, 6).map(item => (
                    <Link to={`/phim/${item.slug}`} key={item._id}
                      onClick={() => { setSearchMovies([]); setKeywords(''); setSearchOpen(false) }}>
                      <li className='flex items-center gap-4 px-4 py-3 border-b border-white/5
                        hover:bg-white/5 active:bg-white/10 cursor-pointer transition-colors'>
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
                          </div>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
                <button
                  type='submit'
                  className='w-full py-3 text-[13px] text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-center font-medium'
                >
                  Xem tất cả kết quả cho "{keywords}" →
                </button>
              </div>
            )}
          </div>
          <button type='button' onClick={() => { setSearchOpen(false); setSearchMovies([]); setKeywords('') }}
            className='flex-shrink-0 text-white p-1 hover:text-red-400 transition'>
            <FaTimes className='w-5 h-5' />
          </button>
        </form>
      )}

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <nav className='absolute top-full left-0 w-full bg-[#0f111a] md:hidden z-[60] shadow-xl overflow-y-auto max-h-[calc(100dvh-60px)]'>
          <ul className='flex flex-col divide-y divide-white/10'>
            <li className='px-6 py-4 text-white text-[15px]'>
              <Link to="/" onClick={closeAll}>Trang chủ</Link>
            </li>
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
            <li className='px-6 py-4 text-white text-[15px]'>
              <Link to="/yeu-thich" onClick={closeAll} className='flex items-center gap-2'>
                <FaHeart className='text-pink-400' /> Yêu thích
              </Link>
            </li>
            <li className='px-6 py-4 text-white text-[15px]'>
              <Link to="/lich-su" onClick={closeAll} className='flex items-center gap-2'>
                <FaHistory /> Lịch sử xem
              </Link>
            </li>
            {token ? (
              <li className='px-6 py-4'>
                <Link to='/ho-so' onClick={closeAll} className='flex items-center gap-3 mb-3'>
                  <div className='w-9 h-9 rounded-full bg-red-600/30 border border-red-500/30 flex items-center justify-center
                    text-red-300 font-bold text-[13px] flex-shrink-0 select-none'>
                    {(profile?.username || profile?.data?.username || 'T')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className='text-white text-[14px] font-medium'>{profile?.username || profile?.data?.username || 'Tài khoản'}</p>
                    <p className='text-gray-500 text-[11px]'>Xem hồ sơ</p>
                  </div>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className='text-red-400 text-[14px] hover:text-red-300 transition'
                >
                  Đăng xuất
                </button>
              </li>
            ) : (
              <li className='px-6 py-4 text-white text-[15px]'>
                <Link to="/dang-nhap" onClick={closeAll} className='flex items-center gap-2'>
                  <FaUser /> Đăng nhập
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
