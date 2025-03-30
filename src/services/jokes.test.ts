import { API, Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { Operation as PatchOperation } from 'fast-json-patch'

import { getInitialData, getJoke, getJokeCount, getRandomJokes, patchJoke, postJoke } from './jokes'
import { initialResponse } from '@test/__mocks__'
import { JokeResponse } from '@types'

jest.mock('@aws-amplify/analytics')
jest.mock('aws-amplify')

describe('Joke service', () => {
  const randomJokeResult: JokeResponse[] = [
    { data: { contents: 'rofl' }, id: 3 },
    { data: { contents: 'lol' }, id: 74 },
  ]

  beforeAll(() => {
    const userSession = { getIdToken: () => ({ getJwtToken: () => '' }) } as CognitoUserSession
    jest.mocked(Auth).currentSession.mockResolvedValue(userSession)
  })

  describe('getInitialData', () => {
    beforeAll(() => {
      jest.mocked(API).get.mockResolvedValue(initialResponse)
    })

    test('Expect results from initial endpoint', async () => {
      const result = await getInitialData()
      expect(result).toEqual(initialResponse)
      expect(API.get).toHaveBeenCalledWith('JokesAPIGatewayUnauthenticated', '/jokes/initial', {})
    })
  })

  describe('getJoke', () => {
    beforeAll(() => {
      jest.mocked(API).get.mockImplementation(async (_, path) => {
        return randomJokeResult[parseInt(path.split('/').pop() as string, 10)]
      })
    })

    test.each(Object.keys(randomJokeResult) as unknown as number[])(
      'Expect results from joke endpoint',
      async (expectedId: number) => {
        const result = await getJoke(expectedId)
        expect(result).toEqual(randomJokeResult[expectedId])
        expect(API.get).toHaveBeenCalledWith('JokesAPIGatewayUnauthenticated', `/jokes/${expectedId}`, {})
      }
    )
  })

  describe('getJokeCount', () => {
    const count = 42

    beforeAll(() => {
      jest.mocked(API).get.mockResolvedValue({ count })
    })

    test('Expect results from count endpoint', async () => {
      const result = await getJokeCount()
      expect(result).toEqual({ count })
      expect(API.get).toHaveBeenCalledWith('JokesAPIGatewayUnauthenticated', '/jokes/count', {})
    })
  })

  describe('getRandomJokes', () => {
    const recentIndexes = ['32', '45', '79']

    beforeAll(() => {
      jest.mocked(API).get.mockResolvedValue(randomJokeResult)
    })

    test('expect results using recentIndexes', async () => {
      const result = await getRandomJokes(recentIndexes)

      expect(result).toEqual(randomJokeResult)
      expect(API.get).toHaveBeenCalledWith('JokesAPIGatewayUnauthenticated', '/jokes/random', {
        queryStringParameters: { avoid: '32,45,79', count: '3' },
      })
    })
  })

  describe('postJoke', () => {
    const postEndpoint = jest.fn()
    const joke = Object.values(randomJokeResult)[0].data

    beforeAll(() => {
      jest.mocked(API).post.mockImplementation(postEndpoint)
    })

    test('expect endpoint called with joke', async () => {
      await postJoke(joke)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(API.post).toHaveBeenCalledWith('JokesAPIGateway', '/jokes', { body: joke })
    })

    test('expect result from call returned', async () => {
      const expectedResult = { id: '148' }
      postEndpoint.mockReturnValue(expectedResult)

      const result = await postJoke(joke)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('patchJoke', () => {
    const patchEndpoint = jest.fn()
    const index = Object.keys(randomJokeResult)[0] as unknown as number
    const operation = [
      {
        op: 'add',
        path: '/foo',
        value: 'bar',
      },
    ] as unknown as PatchOperation[]

    beforeAll(() => {
      jest.mocked(API).patch.mockImplementation(patchEndpoint)
    })

    test('expect endpoint called with index and patch operation', async () => {
      await patchJoke(index, operation)
      expect(patchEndpoint).toHaveBeenCalledTimes(1)
      expect(API.patch).toHaveBeenCalledWith('JokesAPIGateway', `/jokes/${index}`, {
        body: operation,
      })
    })
  })
})
