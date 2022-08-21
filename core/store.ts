import { configureStore, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import Toast from 'react-native-toast-message'
import { cardsApi } from '../features/cards/data/cardsApi'
import { studyApi } from '../features/cards/data/studyApi'
import { decksApi } from '../features/home/data/homeApi'

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    Toast.show({
      type: 'error',
      text1: 'Wystąpił błąd',
      text2: action.error.message,
    })
  }

  return next(action)
}

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
      .concat(studyApi.middleware)
      .concat(rtkQueryErrorLogger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
