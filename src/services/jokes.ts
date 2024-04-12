import { apiName, apiNameUnauthenticated } from '@config/amplify'
import { InitialResponse, JokeCount, JokeResponse, JokeType, PostResponse } from '@types'
import { API } from 'aws-amplify'
import { Operation as PatchOperation } from 'fast-json-patch'

const fetchCount = process.env.GATSBY_JOKE_API_FETCH_COUNT

export const getInitialData = async (): Promise<InitialResponse> =>
  API.get(apiNameUnauthenticated, '/jokes/initial', {})

export const getJoke = async (index: number): Promise<JokeType> =>
  API.get(apiNameUnauthenticated, `/jokes/${index}`, {})

export const getJokeCount = async (): Promise<JokeCount> => API.get(apiNameUnauthenticated, '/jokes/count', {})

export const getRandomJokes = async (recentIndexes: string[]): Promise<JokeResponse[]> =>
  API.get(apiNameUnauthenticated, '/jokes/random', {
    queryStringParameters: {
      avoid: recentIndexes.join(','),
      count: fetchCount,
    },
  })

export const patchJoke = async (index: number, operations: PatchOperation[]): Promise<string> =>
  API.patch(apiName, `/jokes/${index}`, {
    body: operations,
  })

export const postJoke = async (joke: JokeType): Promise<PostResponse> =>
  API.post(apiName, '/jokes', {
    body: joke,
  })
