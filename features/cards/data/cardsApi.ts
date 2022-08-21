import { database } from '../../../core/database'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

import { sql } from '@databases/expo'
import { SingleCard } from '../domain/card'

export const cardsApi = createApi({
  reducerPath: 'cardsApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Cards'], // @TODO: @kamil fixme
  endpoints: (builder) => ({
    getAllForDeck: builder.query<SingleCard[], { deckId: number }>({
      providesTags: ['Cards'],
      async queryFn(params: { deckId: number }) {
        const result = await database.query(sql`SELECT * FROM cards WHERE deckid=${params.deckId};`)

        return {
          data: result.map((r) => {
            return {
              id: r.id,
              front: r.front,
              back: r.back,
            }
          }),
        }
      },
    }),
    addCard: builder.mutation<SingleCard, { deckId: number; front: string; back: string }>({
      invalidatesTags: ['Cards'],
      async queryFn(params: { deckId: number; front: string; back: string }) {
        const id = await database.query(
          sql`INSERT into cards (deckid, front, back) VALUES (${params.deckId},${params.front},${params.back}) RETURNING id;`,
        )

        return {
          data: {
            id: id[0],
            front: params.front,
            back: params.back,
          },
        }
      },
    }),
    getCard: builder.query<SingleCard | null, { deckId: number; cardId: number }>({
      providesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
      async queryFn(params: { deckId: number; cardId: number }) {
        const result = await database.query(
          sql`SELECT * FROM cards WHERE deckid=${params.deckId} and id=${params.cardId};`,
        )
        if (!result.length) {
          return {
            data: null,
          }
        }
        return {
          data: {
            id: result[0].id,
            front: result[0].front,
            back: result[0].back,
          },
        }
      },
    }),
    editCard: builder.mutation<{}, { deckId: number; cardId: number; front: string; back: string }>(
      {
        invalidatesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
        async queryFn(params: { deckId: number; cardId: number; front: string; back: string }) {
          await database.query(
            sql`UPDATE cards SET front=${params.front}, back=${params.back} WHERE deckid=${params.deckId} and id=${params.cardId}`,
          )

          return {
            data: {},
          }
        },
      },
    ),
    deleteCard: builder.mutation<{}, { deckId: number; cardId: number }>({
      invalidatesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
      async queryFn(params: { deckId: number; cardId: number }) {
        await database.query(
          sql`DELETE FROM cards WHERE deckid=${params.deckId} and id=${params.cardId}`,
        )

        return {
          data: {},
        }
      },
    }),
  }),
})

export const {
  useGetAllForDeckQuery,
  useAddCardMutation,
  useEditCardMutation,
  useDeleteCardMutation,
  useGetCardQuery,
} = cardsApi
