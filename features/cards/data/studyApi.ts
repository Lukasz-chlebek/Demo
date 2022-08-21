import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { database } from '../../../core/database'
import { sql } from '@databases/expo'
import { StudyItem, StudyResponse } from '../domain/study'

let dbStudy: { [key: string]: StudyItem[] } = {
  id1: [
    {
      cardId: 1,
    },
    {
      cardId: 2,
    },
  ],
}

export const studyApi = createApi({
  reducerPath: 'studyApi',
  baseQuery: fakeBaseQuery<unknown>(),
  tagTypes: ['Study'], // @TODO: @kamil fixme
  endpoints: (builder) => ({
    get: builder.query<StudyItem[], { deckId: number }>({
      providesTags: ['Study'],
      async queryFn(params) {
        return {
          data: dbStudy[params.deckId] || [],
        }
      },
    }),
    store: builder.mutation<boolean, { cardId: number; response: StudyResponse }>({
      invalidatesTags: ['Study'],
      async queryFn(params) {
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

export const { useGetQuery, useStoreMutation } = studyApi
