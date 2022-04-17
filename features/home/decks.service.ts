import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Deck } from './deck'

// @TODO: @kamil sqlite
let db = [
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
    editDeckName: builder.mutation<Deck, { deckId: string; name: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(body: any) {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        db = db.map((i) => {
          if (i.id === body.deckId) {
            return {
              ...i,
              name: body.name,
            }
          }
          return i
        })

        return {
          data: db.find((i) => i.id === body.deckId) as Deck,
        }
      },
    }),
  }),
})

export const { useGetAllQuery, useAddDeckMutation, useEditDeckNameMutation } = decksApi
