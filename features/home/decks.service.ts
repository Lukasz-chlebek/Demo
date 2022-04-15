import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Deck } from './deck'

export const decksApi = createApi({
  reducerPath: 'decksApi',
  baseQuery: fakeBaseQuery<unknown>(),

  endpoints: (builder) => ({
    getAll: builder.query<Deck[], void>({
      async queryFn() {
        // @TODO: @kamil sqlite
        return {
          data: [
            {
              id: 'id1',
              name: 'nazwa',
              stats: {
                new: 0,
                review: 0,
              },
            },
          ],
        }
      },
    }),
  }),
})

export const { useGetAllQuery } = decksApi
