import { configureStore } from '@reduxjs/toolkit'
import { cardsApi } from '../features/cards/data/cards_api'
import { studyApi } from '../features/cards/data/study_api'
import { decksApi } from '../features/home/data/home_api'

export const store = configureStore({
  reducer: {
    [decksApi.reducerPath]: decksApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [studyApi.reducerPath]: studyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(decksApi.middleware)
      .concat(cardsApi.middleware)
      .concat(studyApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
