import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { database } from '../../../core/database'
import { sql } from '@databases/expo'
import { Deck } from '../domain/deck'

export const decksApi = createApi({
  reducerPath: 'decksApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Decks'],
  endpoints: (builder) => ({
    getAll: builder.query<Deck[], void>({
      providesTags: ['Decks'],
      async queryFn() {
        const decks = await database.query(sql`SELECT * FROM decks;`)
        return {
          data: decks.map((deck) => ({
            ...deck,
            stats: {
              new: 0,
              review: 0, // @TODO: @kamil
            },
          })),
        }
      },
    }),
    addDeck: builder.mutation<Deck, { name: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(params) {
        const id = await database.query(
          sql`INSERT into decks (name) VALUES (${params.name}) RETURNING id;`,
        )
        return {
          data: {
            id: id[0],
            name: params.name,
            stats: {
              new: 0,
              review: 0, // @TODO: @kamil
            },
          },
        }
      },
    }),
    editDeckName: builder.mutation<{}, { deckId: number; name: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(params) {
        await database.query(sql`UPDATE decks SET name=${params.name} WHERE id=${params.deckId}`)

        return {
          data: {},
        }
      },
    }),
    deleteDeck: builder.mutation<{}, { deckId: number }>({
      invalidatesTags: ['Decks'],
      async queryFn(params) {
        await database.query(sql`DELETE FROM decks WHERE id=${params.deckId}`)

        return {
          data: {},
        }
      },
    }),
  }),
})

export const {
  useGetAllQuery,
  useAddDeckMutation,
  useEditDeckNameMutation,
  useDeleteDeckMutation,
} = decksApi
