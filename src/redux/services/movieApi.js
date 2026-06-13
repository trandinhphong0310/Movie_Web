import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { filterNonAdultMovies, isAdultCategory } from '../../utils/adultFilter'

function buildParams({ page = 1, limit = 24, country = '', category = '', year = '', sort = '' } = {}) {
  const p = new URLSearchParams({ page, limit })
  if (country)  p.set('country', country)
  if (category) p.set('category', category)
  if (year)     p.set('year', year)
  if (sort) {
    const [field, type] = sort.split('|')
    if (field) p.set('sort_field', field)
    if (type)  p.set('sort_type', type)
  }
  return p.toString()
}

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_KEY }),
  endpoints: (builder) => ({
    getHomeMovies: builder.query({
      query: () => '/home',
      transformResponse: (response) => filterNonAdultMovies(response.data.items),
    }),
    getMoviesGenre: builder.query({
      query: () => '/the-loai',
      transformResponse: (response) => response.data.items.filter(item => !isAdultCategory(item)),
    }),
    getMoviesCountry: builder.query({
      query: () => '/quoc-gia',
      transformResponse: (response) => response.data.items,
    }),
    getMoviesByGenre: builder.query({
      query: ({ slug, ...rest }) => `/the-loai/${slug}?${buildParams(rest)}`,
      transformResponse: (response) => ({
        ...response.data,
        items: filterNonAdultMovies(response.data.items),
      }),
    }),
    getMoviesByCountry: builder.query({
      query: ({ slug, ...rest }) => `/quoc-gia/${slug}?${buildParams(rest)}`,
      transformResponse: (response) => ({
        ...response.data,
        items: filterNonAdultMovies(response.data.items),
      }),
    }),
    getMoviesBySlugCategory: builder.query({
      query: ({ slug, ...rest }) => `/danh-sach/${slug}?${buildParams(rest)}`,
      transformResponse: (response) => ({
        ...response.data,
        items: filterNonAdultMovies(response.data.items),
      }),
    }),
    searchMoviesByKeyWords: builder.query({
      query: (keywords) => `/tim-kiem?keyword=${encodeURIComponent(keywords)}`,
      transformResponse: (response) => ({
        ...response.data,
        items: filterNonAdultMovies(response.data.items),
      }),
    }),
    getMoviesDetail: builder.query({
      query: (slug) => `/phim/${slug}`,
      transformResponse: (response) => response.data,
    }),
    getActorForMovies: builder.query({
      query: (slug) => `/phim/${slug}/peoples`,
      transformResponse: (response) => response.data,
    }),
  }),
})

export const {
  useGetHomeMoviesQuery,
  useGetMoviesGenreQuery,
  useGetMoviesCountryQuery,
  useGetMoviesByGenreQuery,
  useGetMoviesByCountryQuery,
  useGetMoviesBySlugCategoryQuery,
  useSearchMoviesByKeyWordsQuery,
  useGetMoviesDetailQuery,
  useGetActorForMoviesQuery,
} = movieApi
