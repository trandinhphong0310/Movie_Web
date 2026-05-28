import { configureStore } from '@reduxjs/toolkit'
import { movieApi } from './services/movieApi'
import { authApi } from './services/authApi'
import { commentApi } from './services/commentApi'

export const store = configureStore({
  reducer: {
    [movieApi.reducerPath]: movieApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(movieApi.middleware)
      .concat(authApi.middleware)
      .concat(commentApi.middleware),
})
