import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const commentApi = createApi({
  reducerPath: 'commentApi',
  tagTypes: ['Comments'],
  baseQuery: baseQueryWithReauth,
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
    replyToComment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/comments/${id}/replies`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Comments', id: slug }],
    }),
  }),
})

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReplyToCommentMutation,
} = commentApi
