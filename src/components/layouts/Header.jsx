import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa'
import { FaChevronDown } from 'react-icons/fa'
import { getMoviesCountry, getMoviesGenre, searchMoviesByKeyWords } from '../../api/movie_api'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {

  const [genre, setGenre] = useState([])
  const [country, setCountry] = useState([])
  const [scroll, setScrolled] = useState(false)
  const [searchMovies, setSearchMovies] = useState([])
  const [keywords, setKeywords] = useState('')
  const navigate = useNavigate()
  const base_url = import.meta.env.VITE_BASE_IMG_URL

  useEffect(() => {
    if (!keywords.trim()) {
      setSearchMovies([])
      return
    }

    searchMoviesByKeyWords(keywords)
      .then(data => {
        if (data)
          setSearchMovies(data.items)
      })
  }, [keywords])

  useEffect(() => {
    getMoviesGenre()
      .then(items => {
        if (items) {
          setGenre(items)
        }
      })
  }, [])

  useEffect(() => {
    getMoviesCountry()
      .then(items => {
        if (items) {
          setCountry(items)
        }
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50)
        setScrolled(true)
      else
        setScrolled(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (keywords.trim()) {
      navigate(`/tim-kiem?keyword=${keywords}`)
      setSearchMovies([])
    }
  }

  return (
    <div className={`flex justify-between px-16 z-10 w-full fixed transition-all duration-300 ease-in-out
    ${scroll ? 'bg-[#0f111a] h-[70px] py-5' : 'bg-[rgba(34,34,34,0.4)] h-[90px] py-8'}`}>
      <p className='leading-[25px] h-[65px] font-bold text-[32px] text-red-500 uppercase'>Movie</p>
      <ul className='flex gap-7'>
        <li className='inline-flex text-white text-[14px]'>
          <Link to="/">Trang chủ</Link>
        </li>
        <li className='inline-flex text-white text-[14px] group cursor-pointer'>
          Thể loại<FaChevronDown className='text-white ml-2 h-[20px] w-[12px]' />
          <ul className="absolute grid grid-cols-4 opacity-0 invisible 
               group-hover:opacity-100 group-hover:visible  
               bg-[#161616] rounded-none border-0 
               w-full max-w-[800px] shadow-[0_0_30px_0_rgba(22,22,22,0.1)] 
               left-[30%] top-[100px] z-[99] p-4 gap-2 transition
               before:content-[''] before:absolute before:top-[-40px] before:left-0 
                before:w-full before:h-[40px] before:bg-transparent">
            {genre.map((item) => (
              <li key={item._id} className='text-[14px] p-2 hover:text-red-500 hover:shadow'>
                <Link to={`/the-loai/${item.slug}?page=1&limit=24`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </li>
        <li className='inline-flex text-white text-[14px] group cursor-pointer'>
          Quốc gia<FaChevronDown className='text-white ml-2 h-[20px] w-[12px]' />
          <ul className="absolute grid grid-cols-4 opacity-0 invisible 
               group-hover:opacity-100 group-hover:visible  
               bg-[#161616] rounded-none border-0 
               w-full max-w-[800px] shadow-[0_0_30px_0_rgba(22,22,22,0.1)] 
               left-[30%] top-[100px] z-[99] p-4 gap-2 transition
               before:content-[''] before:absolute before:top-[-40px] before:left-0 
                before:w-full before:h-[40px] before:bg-transparent">
            {country.map((item) => (
              <li key={item._id} className='text-[14px] p-2 hover:text-red-500 hover:shadow'>
                <Link to={`/quoc-gia/${item.slug}?page=1&limit=24`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </li>
        <li className='inline-flex text-white text-[14px] cursor-pointer'>
          <Link to={`/danh-sach/phim-le?page=1&limit=24`}>Phim Lẻ</Link>
        </li>
        <li className='inline-flex text-white text-[14px] cursor-pointer'>
          <Link to={`/danh-sach/phim-bo?page=1&limit=24`}>Phim Bộ</Link>
        </li>
      </ul>
      <form onSubmit={handleSubmit} className="w-[300px] relative">
        <div className="flex gap-10 relative items-center">
          {/* icon search */}
          <div className="absolute left-3">
            <FaSearch className="text-white w-4 h-4" />
          </div>

          {/* input search */}
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Tìm kiếm phim, diễn viên"
            className="bg-[rgba(255,255,255,.08)] text-white pl-8 pr-2 py-2 border border-transparent rounded-xl text-sm w-full h-[44.8px] focus:outline-none focus:border-white"
          />

          {searchMovies.length > 0 && (
            <ul className="absolute top-[110%] right-0
         bg-[#161616] rounded-md shadow-lg max-h-140 px-4 z-50">
              {searchMovies
                .slice(0, 6)
                .map(item => (
                  <li
                    key={item._id}
                    className="flex items-center gap-3 px-2 py-4 hover:bg-[rgba(15, 17, 26, .95)] cursor-pointer"
                  >
                    <img
                      src={`${base_url}/${item.thumb_url}`}
                      alt={item.name}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <span className="text-white text-sm line-clamp-1">{item.name}</span>
                  </li>
                ))}
            </ul>
          )}
          {/* user icon */}
          <ul className="flex items-center justify-center w-[45px] h-[44.8px] border border-transparent rounded-xl bg-[rgba(255,255,255,.08)]">
            <FaUser className="text-red-500" />
          </ul>
        </div>
      </form>
    </div>
  )
}
