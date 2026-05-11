import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const movieApi = createApi({
  reducerPath: 'movieApi',
  // Lấy baseUrl từ file .env giống như file api cũ của bạn
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_KEY }),
  // Khai báo các API endpoints
  endpoints: (builder) => ({
    getHomeMovies: builder.query({
      query: () => '/home',
      transformResponse: (response) => response.data.items,
    }),
    getMoviesGenre: builder.query({
      query: () => '/the-loai',
      transformResponse: (response) => response.data.items,
    }),
    getMoviesCountry: builder.query({
      query: () => '/quoc-gia',
      transformResponse: (response) => response.data.items,
    }),
    getMoviesByGenre: builder.query({
      query: ({ slug, page = 1, limit = 24 }) => `/the-loai/${slug}?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data,
    }),
    getMoviesByCountry: builder.query({
      query: ({ slug, page = 1, limit = 24 }) => `/quoc-gia/${slug}?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data,
    }),
    getMoviesBySlugCategory: builder.query({
      query: ({ slug, page = 1, limit = 24 }) => `/danh-sach/${slug}?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data,
    }),
    searchMoviesByKeyWords: builder.query({
      query: (keywords) => `/tim-kiem?keyword=${keywords}`,
      transformResponse: (response) => response.data,
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
  useGetActorForMoviesQuery
} = movieApi
