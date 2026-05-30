import { configureStore } from '@reduxjs/toolkit'
import { movieApi } from './services/movieApi'
import { authApi } from './services/authApi'
import { commentApi } from './services/commentApi'
import { userApi } from './services/userApi'

export const store = configureStore({
  reducer: {
    [movieApi.reducerPath]: movieApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(movieApi.middleware)
      .concat(authApi.middleware)
      .concat(commentApi.middleware)
      .concat(userApi.middleware),
})
