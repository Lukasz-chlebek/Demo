import { createSlice } from '@reduxjs/toolkit'

export interface Deck {
  id: string
  name: string
  stats: {
    new: number
    review: number
  }
}

export interface HomeState {
  decks: Deck[]
}

const initialState: HomeState = {
  decks: [],
}

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
})

export const {} = homeSlice.actions

export default homeSlice.reducer
