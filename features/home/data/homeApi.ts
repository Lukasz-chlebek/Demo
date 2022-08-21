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
        return {
          data: await database.query(sql`SELECT * FROM decks;`),
        }
      },
    }),
    addDeck: builder.mutation<Deck, { name: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(body) {
        const id = await database.query(
          sql`INSERT into decks (name) VALUES (${body.name}) RETURNING id;`,
        )
        return {
          data: {
            id: +id,
            name: body.name,
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
      async queryFn(body) {
        await database.query(sql`UPDATE decks SET name=${body.name} WHERE id=${body.deckId}`)

        return {
          data: {},
        }
      },
    }),
    deleteDeck: builder.mutation<{}, { deckId: number }>({
      invalidatesTags: ['Decks'],
      async queryFn(body) {
        await database.query(sql`DELETE FROM decks WHERE id=${body.deckId}`)

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
