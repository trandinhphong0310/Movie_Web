import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
    tagTypes: ['Profile'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) headers.set('Authorization', `Bearer ${token}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (body) => ({
                url: '/users/register',
                method: 'POST',
                body,
            }),
        }),
        login: builder.mutation({
            query: (body) => ({
                url: '/users/login',
                method: 'POST',
                body,
            }),
        }),
        getProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (body) => ({
                url: '/users/profile',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
})

export const { useRegisterMutation, useLoginMutation, useGetProfileQuery, useUpdateProfileMutation } = authApi
