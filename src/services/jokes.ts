import { get, patch, post } from 'aws-amplify/api'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Operation as PatchOperation } from 'fast-json-patch'

import { apiName, apiNameUnauthenticated } from '@config/amplify'
import { JokeResponse, JokeType, PostResponse } from '@types'

type AnyBody = any

const fetchCount = process.env.NEXT_PUBLIC_JOKE_API_FETCH_COUNT

const authHeaders = async (): Promise<Record<string, string>> => {
  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.toString()
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  } catch {
    // Not signed in
  }
  return {}
}

export const getJoke = async (id: string): Promise<JokeType> => {
  const { body } = await get({ apiName: apiNameUnauthenticated, path: `/jokes/${id}` }).response
  return body.json() as unknown as Promise<JokeType>
}

export const getRandomJokes = async (recentIds: string[]): Promise<JokeResponse[]> => {
  const { body } = await get({
    apiName: apiNameUnauthenticated,
    options: { queryParams: { avoid: recentIds.join(','), count: String(fetchCount) } },
    path: '/jokes/random',
  }).response
  return body.json() as unknown as Promise<JokeResponse[]>
}

export const patchJoke = async (id: string, operations: PatchOperation[]): Promise<JokeType> => {
  const { body } = await patch({
    apiName,
    options: { body: operations as AnyBody, headers: await authHeaders() },
    path: `/jokes/${id}`,
  }).response
  return body.json() as unknown as Promise<JokeType>
}

export const postJoke = async (joke: JokeType): Promise<PostResponse> => {
  const { body } = await post({
    apiName,
    // Amplify v6 retries failed requests up to three times by default, including POST — v5's
    // API.post did not retry at all. Creating a joke is the only non-idempotent call here, so a
    // 5xx returned after the write had already landed would create duplicates. GET and PATCH are
    // safe to replay and keep the default strategy.
    options: { body: joke as AnyBody, headers: await authHeaders(), retryStrategy: { strategy: 'no-retry' } },
    path: '/jokes',
  }).response
  return body.json() as unknown as Promise<PostResponse>
}
