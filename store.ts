import { configureStore } from '@reduxjs/toolkit'
import { decksApi } from './features/home/decks.service'

export const store = configureStore({
  reducer: {
    [decksApi.reducerPath]: decksApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(decksApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
