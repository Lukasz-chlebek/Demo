import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Deck, SingleCard, StudyItem } from './model'

import connect, { sql } from '@databases/expo'
import { Platform } from 'react-native'

const database = connect('flash-card')

export const ready = () => {
  if (Platform.OS === 'web') {
    throw new Error('Web not supported due to SQLite usage')
  }
  database.tx(function* (tx) {
    yield tx.query(sql`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INT NOT NULL
    );
  `)

    const versionRecord = yield tx.query(sql`
    SELECT version FROM schema_version;
  `)

    const version = versionRecord.length ? versionRecord[0].version : 0

    if (version < 1) {
      yield tx.query(sql`
      CREATE TABLE decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `)
    }

    const LATEST_VERSION = 1
    if (version === 0) {
      yield tx.query(sql`
      INSERT INTO schema_version
      VALUES (${LATEST_VERSION});
    `)
    } else {
      yield tx.query(sql`
      UPDATE schema_version
      SET version = ${LATEST_VERSION};
    `)
    }
  })
}

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

let dbCards: { [key: string]: SingleCard[] } = {
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
    getCard: builder.query<SingleCard | null, { deckId: string; cardId: string }>({
      providesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
      async queryFn(params: { deckId: string; cardId: string }) {
        console.log('dbCards[params.deckId]', dbCards)
        return {
          data: dbCards[params.deckId].find((card) => card.id === params.cardId) || null,
        }
      },
    }),
    editCard: builder.mutation<
      SingleCard,
      { deckId: string; cardId: string; front: string; back: string }
    >({
      invalidatesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
      async queryFn(params: { deckId: string; cardId: string; front: string; back: string }) {
        const card = {
          id: 'id1' + Math.random(),
          front: params.front,
          back: params.back,
        }

        dbCards[params.deckId] = dbCards[params.deckId].map((card) => {
          if (card.id === params.cardId) {
            return {
              id: params.cardId,
              front: params.front,
              back: params.back,
            }
          }
          return card
        })

        console.log('dbCards', dbCards)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
          data: card,
        }
      },
    }),
    deleteCard: builder.mutation<{}, { deckId: string; cardId: string }>({
      invalidatesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
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
let dbStudy: { [key: string]: StudyItem[] } = {
  id1: [
    {
      cardId: 'card1',
    },
    {
      cardId: 'card2',
    },
  ],
}

export const studyApi = createApi({
  reducerPath: 'studyApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Study'], // @TODO: @kamil fixme
  endpoints: (builder) => ({
    get: builder.query<StudyItem[], { deckId: string }>({
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
          data: await database.query(sql`SELECT * FROM decks;`),
        }
      },
    }),
    addDeck: builder.mutation<Deck, { name: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(body: any) {
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

export const {
  useGetAllForDeckQuery,
  useAddCardMutation,
  useEditCardMutation,
  useDeleteCardMutation,
  useGetCardQuery,
} = cardsApi
export const { useGetQuery, useStoreMutation } = studyApi
