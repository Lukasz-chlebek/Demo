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

    if (version < 2) {
      yield tx.query(sql`
        CREATE TABLE cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          deckid INTEGER NOT NULL,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          FOREIGN KEY(deckid) REFERENCES decks(id)
        );
      `)
    }

    if (version < 3) {
      yield tx.query(sql`
        CREATE TABLE cards_response (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cardid INTEGER NOT NULL,
          response TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          FOREIGN KEY(cardid) REFERENCES cards(id)
        );
      `)
    }

    const LATEST_VERSION = 3
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

export const cardsApi = createApi({
  reducerPath: 'cardsApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Cards'], // @TODO: @kamil fixme
  endpoints: (builder) => ({
    getAllForDeck: builder.query<SingleCard[], { deckId: string }>({
      providesTags: ['Cards'],
      async queryFn(params: { deckId: string }) {
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
    addCard: builder.mutation<SingleCard, { deckId: string; front: string; back: string }>({
      invalidatesTags: ['Cards'],
      async queryFn(params: { deckId: string; front: string; back: string }) {
        const id = await database.query(
          sql`INSERT into cards (deckid, front, back) VALUES (${params.deckId},${params.front},${params.back}) RETURNING id;`,
        )

        return {
          data: {
            id,
            front: params.front,
            back: params.back,
          },
        }
      },
    }),
    getCard: builder.query<SingleCard | null, { deckId: string; cardId: string }>({
      providesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
      async queryFn(params: { deckId: string; cardId: string }) {
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
    editCard: builder.mutation<{}, { deckId: string; cardId: string; front: string; back: string }>(
      {
        invalidatesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
        async queryFn(params: { deckId: string; cardId: string; front: string; back: string }) {
          await database.query(
            sql`UPDATE cards SET front=${params.front}, back=${params.back} WHERE deckid=${params.deckId} and id=${params.cardId}`,
          )

          return {
            data: {},
          }
        },
      },
    ),
    deleteCard: builder.mutation<{}, { deckId: string; cardId: string }>({
      invalidatesTags: (result, error, arg) => [{ type: 'Cards', id: arg.cardId }],
      async queryFn(params: { deckId: string; cardId: string }) {
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
      { cardId: string; response: 'dontknow' | 'difficult' | 'know' }
    >({
      invalidatesTags: ['Study'],
      async queryFn(params: {
        deckId: string // @TODO: @kamil
        cardId: string
        response: 'dontknow' | 'difficult' | 'know'
      }) {
        const id = await database.query(
          sql`INSERT into cards_response (cardid, response, created_at) VALUES (${params.cardId},${
            params.response
          },${new Date().getTime()})`,
        )

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
    editDeckName: builder.mutation<{}, { deckId: string; name: string }>({
      invalidatesTags: ['Decks'],
      async queryFn(body) {
        await database.query(sql`UPDATE decks SET name=${body.name} WHERE id=${body.deckId}`)

        return {
          data: {},
        }
      },
    }),
    deleteDeck: builder.mutation<{}, { deckId: string }>({
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

export const {
  useGetAllForDeckQuery,
  useAddCardMutation,
  useEditCardMutation,
  useDeleteCardMutation,
  useGetCardQuery,
} = cardsApi
export const { useGetQuery, useStoreMutation } = studyApi
