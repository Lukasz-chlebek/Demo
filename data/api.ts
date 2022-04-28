import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Deck, SingleCard } from './model'

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

let dbCards: { [key: string]: SingleCard[] } = {}

export const cardsApi = createApi({
  reducerPath: 'cardsApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Cards'], // @TODO: @kamil fixme
  endpoints: (builder) => ({
    getAllForDeck: builder.query<SingleCard[], { deckId: string }>({
      providesTags: ['Cards'],
      async queryFn(params: { deckId: string }) {
        console.log('dbCards[params.deckId]', dbCards, params.deckId)
        return {
          data: dbCards[params.deckId] || [],
        }
      },
    }),
    addCard: builder.mutation<SingleCard, { deckId: string; front: string; back: string }>({
      invalidatesTags: ['Cards'],
      async queryFn(params: { deckId: string; front: string; back: string }) {
        const card = {
          id: 'id1' + Math.random(),
          front: params.front,
          back: params.back,
        }

        if (!dbCards[params.deckId]) {
          dbCards[params.deckId] = []
        }
        dbCards[params.deckId].push(card)

        console.log('dbCards', dbCards)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
          data: card,
        }
      },
    }),
    deleteCard: builder.mutation<{}, { deckId: string; cardId: string }>({
      invalidatesTags: ['Cards'],
      async queryFn(params: { deckId: string; cardId: string }) {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        dbCards[params.deckId] = dbCards[params.deckId] = dbCards[params.deckId].filter((i) => {
          return i.id !== params.cardId
        })

        return {
          data: {},
        }
      },
    }),
  }),
})
let dbStudy: any = {
  id1: [
    {
      id: 'card1',
      front: 'test',
      back: 'back',
    },
    {
      id: 'card2',
      front: 'test2',
      back: 'back2',
    },
  ],
}

export const studyApi = createApi({
  reducerPath: 'studyApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Study'], // @TODO: @kamil fixme
  endpoints: (builder) => ({
    get: builder.query<SingleCard[], { deckId: string }>({
      providesTags: ['Study'],
      async queryFn(params: { deckId: string }) {
        return {
          data: dbStudy[params.deckId] || [],
        }
      },
    }),
    store: builder.mutation<
      boolean,
      { deckId: string; cardId: string; response: 'dontknow' | 'difficult' | 'know' }
    >({
      invalidatesTags: ['Study'],
      async queryFn(params: {
        deckId: string
        cardId: string
        response: 'dontknow' | 'difficult' | 'know'
      }) {
        console.log('store', params)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
          data: true,
        }
      },
    }),
  }),
})

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
    deleteDeck: builder.mutation<{}, { deckId: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(body: any) {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        db = db.filter((i) => {
          return i.id !== body.deckId
        })

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

export const { useGetAllForDeckQuery, useAddCardMutation, useDeleteCardMutation } = cardsApi
export const { useGetQuery, useStoreMutation } = studyApi
