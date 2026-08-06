import { get, patch, post } from 'aws-amplify/api'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Operation as PatchOperation } from 'fast-json-patch'

import { getJoke, getRandomJokes, patchJoke, postJoke } from './jokes'
import { JokeResponse } from '@types'

jest.mock('@aws-amplify/analytics')
jest.mock('aws-amplify/api')
jest.mock('aws-amplify/auth')
jest.mock('@config/amplify', () => ({
  apiName: 'JokesAPIGateway',
  apiNameUnauthenticated: 'JokesAPIGatewayUnauthenticated',
}))

const mockResponse = (data: unknown): any => ({
  response: Promise.resolve({ body: { json: () => Promise.resolve(data) } }),
})

describe('Joke service', () => {
  const randomJokeResult: JokeResponse[] = [
    { data: { contents: 'rofl' }, id: 'joke1' },
    { data: { contents: 'lol' }, id: 'joke2' },
  ]

  beforeAll(() => {
    jest.mocked(fetchAuthSession).mockResolvedValue({
      tokens: { idToken: { toString: () => 'mock-jwt-token', payload: {} } },
    } as any)
  })

  describe('getJoke', () => {
    beforeAll(() => {
      jest.mocked(get).mockReturnValue(mockResponse(randomJokeResult[0].data))
    })

    it('returns joke from jokes endpoint', async () => {
      const result = await getJoke('joke1')

      expect(result).toEqual(randomJokeResult[0].data)
      expect(get).toHaveBeenCalledWith({ apiName: 'JokesAPIGatewayUnauthenticated', path: '/jokes/joke1' })
    })

    it('sends no Authorization header', async () => {
      await getJoke('joke1')

      expect(jest.mocked(get).mock.calls[0][0].options?.headers).toBeUndefined()
      expect(fetchAuthSession).not.toHaveBeenCalled()
    })
  })

  describe('getRandomJokes', () => {
    const recentIds = ['id32', 'id45', 'id79']

    beforeAll(() => {
      jest.mocked(get).mockReturnValue(mockResponse(randomJokeResult))
    })

    it('returns random jokes using recentIds', async () => {
      const result = await getRandomJokes(recentIds)

      expect(result).toEqual(randomJokeResult)
      expect(get).toHaveBeenCalledWith({
        apiName: 'JokesAPIGatewayUnauthenticated',
        options: { queryParams: { avoid: 'id32,id45,id79', count: '3' } },
        path: '/jokes/random',
      })
    })

    it('sends no Authorization header', async () => {
      await getRandomJokes(recentIds)

      expect(jest.mocked(get).mock.calls[0][0].options?.headers).toBeUndefined()
      expect(fetchAuthSession).not.toHaveBeenCalled()
    })
  })

  describe('postJoke', () => {
    const joke = Object.values(randomJokeResult)[0].data

    beforeAll(() => {
      jest.mocked(post).mockReturnValue(mockResponse(undefined))
    })

    it('invokes the jokes endpoint to create a joke', async () => {
      await postJoke(joke)

      expect(post).toHaveBeenCalledTimes(1)
      expect(post).toHaveBeenCalledWith({
        apiName: 'JokesAPIGateway',
        options: {
          body: joke,
          headers: { Authorization: 'Bearer mock-jwt-token' },
          retryStrategy: { strategy: 'no-retry' },
        },
        path: '/jokes',
      })
    })

    it('does not retry, because creating a joke is not idempotent', async () => {
      await postJoke(joke)

      expect(jest.mocked(post).mock.calls[0][0].options?.retryStrategy).toEqual({ strategy: 'no-retry' })
    })

    it('returns the result from the create joke endpoint', async () => {
      const expectedResult = { contents: 'LOL', id: 'joke148' }
      jest.mocked(post).mockReturnValueOnce(mockResponse(expectedResult))

      const result = await postJoke(joke)

      expect(post).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('patchJoke', () => {
    const jokeIndex = 'joke42'
    const operation = [
      {
        op: 'add',
        path: '/foo',
        value: 'bar',
      },
    ] as unknown as PatchOperation[]

    beforeAll(() => {
      jest.mocked(patch).mockReturnValue(mockResponse(undefined))
    })

    it('invokes the patch endpoint with index and patch operation', async () => {
      await patchJoke(jokeIndex, operation)

      expect(patch).toHaveBeenCalledTimes(1)
      expect(patch).toHaveBeenCalledWith({
        apiName: 'JokesAPIGateway',
        options: { body: operation, headers: { Authorization: 'Bearer mock-jwt-token' } },
        path: `/jokes/${jokeIndex}`,
      })
    })

    it('returns the result from the patch endpoint', async () => {
      const expectedResult = { contents: 'ROFL' }
      jest.mocked(patch).mockReturnValueOnce(mockResponse(expectedResult))

      const result = await patchJoke(jokeIndex, operation)

      expect(result).toEqual(expectedResult)
    })

    it('sends empty headers when the session cannot be fetched', async () => {
      jest.mocked(fetchAuthSession).mockRejectedValueOnce(new Error('Not signed in'))

      await patchJoke(jokeIndex, operation)

      expect(patch).toHaveBeenCalledWith({
        apiName: 'JokesAPIGateway',
        options: { body: operation, headers: {} },
        path: `/jokes/${jokeIndex}`,
      })
    })

    it('sends empty headers when the session has no id token', async () => {
      jest.mocked(fetchAuthSession).mockResolvedValueOnce({ tokens: undefined } as any)

      await patchJoke(jokeIndex, operation)

      expect(patch).toHaveBeenCalledWith({
        apiName: 'JokesAPIGateway',
        options: { body: operation, headers: {} },
        path: `/jokes/${jokeIndex}`,
      })
    })
  })
})
