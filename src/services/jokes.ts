import { API } from 'aws-amplify'
import { Operation as PatchOperation } from 'fast-json-patch'

import { apiName, apiNameUnauthenticated } from '@config/amplify'
import { JokeCount, JokeResponse, JokeType, PostResponse } from '@types'

const fetchCount = process.env.NEXT_PUBLIC_JOKE_API_FETCH_COUNT

export const getJoke = async (id: string): Promise<JokeType> => API.get(apiNameUnauthenticated, `/jokes/${id}`, {})

export const getJokeCount = async (): Promise<JokeCount> => API.get(apiNameUnauthenticated, '/jokes/count', {})

export const getRandomJokes = async (recentIds: string[]): Promise<JokeResponse[]> =>
  API.get(apiNameUnauthenticated, '/jokes/random', {
    queryStringParameters: {
      avoid: recentIds.join(','),
      count: fetchCount,
    },
  })

export const patchJoke = async (id: string, operations: PatchOperation[]): Promise<JokeType> =>
  API.patch(apiName, `/jokes/${id}`, { body: operations })

export const postJoke = async (joke: JokeType): Promise<PostResponse> => API.post(apiName, '/jokes', { body: joke })
