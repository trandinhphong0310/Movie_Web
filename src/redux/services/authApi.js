import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const authApi = createApi({
    reducerPath: 'authApi',
    tagTypes: ['Profile'],
    baseQuery: baseQueryWithReauth,
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
        logout: builder.mutation({
            query: (refreshToken) => ({
                url: '/users/logout',
                method: 'POST',
                body: { refreshToken },
            }),
            invalidatesTags: ['Profile'],
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

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
} = authApi
