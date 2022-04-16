import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Deck } from './deck'

// @TODO: @kamil sqlite
const db = [
  {
    id: 'id1',
    name: 'nazwa',
    stats: {
      new: 0,
      review: 0,
    },
  },
]
export const decksApi = createApi({
  reducerPath: 'decksApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Decks'],
  endpoints: (builder) => ({
    getAll: builder.query<Deck[], void>({
      providesTags: ['Decks'],
      async queryFn() {
        return {
          data: [...db],
        }
      },
    }),
    addDeck: builder.mutation<Deck, { name: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(body: any) {
        const deck = {
          id: 'id1' + body.name,
          name: body.name,
          stats: {
            new: 0,
            review: 0,
          },
        }
        db.push(deck)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
          data: deck,
        }
      },
    }),
  }),
})

export const { useGetAllQuery, useAddDeckMutation } = decksApi
