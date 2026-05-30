import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['Favorites'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => '/favorites',
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation({
      query: (slug) => ({ url: '/favorites', method: 'POST', body: { slug } }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation({
      query: (slug) => ({ url: `/favorites/${slug}`, method: 'DELETE' }),
      invalidatesTags: ['Favorites'],
    }),
    addHistory: builder.mutation({
      query: (slug) => ({ url: '/history', method: 'POST', body: { slug } }),
    }),
    removeHistory: builder.mutation({
      query: (slug) => ({ url: `/history/${slug}`, method: 'DELETE' }),
    }),
    clearHistory: builder.mutation({
      query: () => ({ url: '/history/clear', method: 'DELETE' }),
    }),
  }),
})

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useAddHistoryMutation,
  useRemoveHistoryMutation,
  useClearHistoryMutation,
} = userApi
