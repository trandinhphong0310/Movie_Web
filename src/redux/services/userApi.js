import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['Favorites', 'History'],
  baseQuery: baseQueryWithReauth,
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
    getHistory: builder.query({
      query: () => '/history',
      providesTags: ['History'],
    }),
    addHistory: builder.mutation({
      query: (body) => ({ url: '/history', method: 'POST', body }),
    }),
    removeHistory: builder.mutation({
      query: (slug) => ({ url: `/history/${slug}`, method: 'DELETE' }),
      invalidatesTags: ['History'],
    }),
    clearHistory: builder.mutation({
      query: () => ({ url: '/history/clear', method: 'DELETE' }),
      invalidatesTags: ['History'],
    }),
  }),
})

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetHistoryQuery,
  useAddHistoryMutation,
  useRemoveHistoryMutation,
  useClearHistoryMutation,
} = userApi
