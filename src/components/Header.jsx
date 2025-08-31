import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa'
import { FaChevronDown } from 'react-icons/fa'
import { getMoviesCountry, getMoviesGenre } from '../api/movie_api'

export default function Header() {

  const [genre, setGenre] = useState([])
  const [country, setCountry] = useState([])

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

  return (
    <div className='flex justify-between py-8 px-16 h-[90px] bg-[rgba(34,34,34,0.4)] z-99 absolute w-full'>
      <p className='leading-[25px] h-[65px] font-bold text-[32px] text-red-500 uppercase'>Movie</p>
      <ul className='flex gap-7'>
        <li className='inline-flex text-white text-[14px]'>Trang chủ</li>
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
              <li key={item._id} className='text-[14px] p-2 hover:text-red-500 hover:shadow'>{item.name}</li>
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
              <li key={item._id} className='text-[14px] p-2 hover:text-red-500 hover:shadow'>{item.name}</li>
            ))}
          </ul>
        </li>
        <li className='inline-flex text-white text-[14px] cursor-pointer'>Phim lẻ</li>
        <li className='inline-flex text-white text-[14px] cursor-pointer'>Phim bộ</li>
      </ul>
      <div className="flex gap-10">
        <FaSearch className='text-white' />
        <ul className='border-r-red-500 w-[45px]'><FaUser className='text-red-500' /></ul>
      </div>
    </div>
  )
}
