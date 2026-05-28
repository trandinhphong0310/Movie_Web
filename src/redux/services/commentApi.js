import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const commentApi = createApi({
  reducerPath: 'commentApi',
  tagTypes: ['Comments'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (slug) => `/comments/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Comments', id: slug }],
    }),
    createComment: builder.mutation({
      query: (body) => ({ url: '/comments', method: 'POST', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'Comments', id: arg.slug }],
    }),
    updateComment: builder.mutation({
      query: ({ id, content, rating }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { content, rating },
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Comments', id: slug }],
    }),
    deleteComment: builder.mutation({
      query: ({ id }) => ({ url: `/comments/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Comments', id: slug }],
    }),
  }),
})

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi
