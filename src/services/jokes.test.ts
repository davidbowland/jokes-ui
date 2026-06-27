import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { API, Auth } from 'aws-amplify'
import { Operation as PatchOperation } from 'fast-json-patch'

import { getJoke, getJokeCount, getRandomJokes, patchJoke, postJoke } from './jokes'
import { JokeResponse } from '@types'

jest.mock('@aws-amplify/analytics')
jest.mock('aws-amplify')

describe('Joke service', () => {
  const randomJokeResult: JokeResponse[] = [
    { data: { contents: 'rofl' }, id: 'joke1' },
    { data: { contents: 'lol' }, id: 'joke2' },
  ]

  beforeAll(() => {
    const userSession = { getIdToken: () => ({ getJwtToken: () => '' }) } as CognitoUserSession
    jest.mocked(Auth).currentSession.mockResolvedValue(userSession)
  })

  describe('getJoke', () => {
    beforeAll(() => {
      jest.mocked(API).get.mockResolvedValue(randomJokeResult[0].data)
    })

    it('returns joke from jokes endpoint', async () => {
      const result = await getJoke('joke1')
      expect(result).toEqual(randomJokeResult[0].data)
      expect(API.get).toHaveBeenCalledWith('JokesAPIGatewayUnauthenticated', '/jokes/joke1', {})
    })
  })

  describe('getJokeCount', () => {
    beforeAll(() => {
      jest.mocked(API).get.mockResolvedValue({ count: 128 })
    })

    it('returns joke count from count endpoint', async () => {
      const result = await getJokeCount()
      expect(result).toEqual({ count: 128 })
      expect(API.get).toHaveBeenCalledWith('JokesAPIGatewayUnauthenticated', '/jokes/count', {})
    })
  })

  describe('getRandomJokes', () => {
    const recentIds = ['id32', 'id45', 'id79']

    beforeAll(() => {
      jest.mocked(API).get.mockResolvedValue(randomJokeResult)
    })

    it('returns random jokes using recentIds', async () => {
      const result = await getRandomJokes(recentIds)

      expect(result).toEqual(randomJokeResult)
      expect(API.get).toHaveBeenCalledWith('JokesAPIGatewayUnauthenticated', '/jokes/random', {
        queryStringParameters: { avoid: 'id32,id45,id79', count: '3' },
      })
    })
  })

  describe('postJoke', () => {
    const postEndpoint = jest.fn()
    const joke = Object.values(randomJokeResult)[0].data

    beforeAll(() => {
      jest.mocked(API).post.mockImplementation(postEndpoint)
    })

    it('invokes the jokes endpoint to create a joke', async () => {
      await postJoke(joke)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(API.post).toHaveBeenCalledWith('JokesAPIGateway', '/jokes', { body: joke })
    })

    it('returns the result from the create joke endpoint', async () => {
      const expectedResult = { index: 148 }
      postEndpoint.mockReturnValue(expectedResult)

      const result = await postJoke(joke)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('patchJoke', () => {
    const patchEndpoint = jest.fn()
    const jokeIndex = 'joke42'
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

    it('invokes the patch endpoint with index and patch operation', async () => {
      await patchJoke(jokeIndex, operation)
      expect(patchEndpoint).toHaveBeenCalledTimes(1)
      expect(API.patch).toHaveBeenCalledWith('JokesAPIGateway', `/jokes/${jokeIndex}`, {
        body: operation,
      })
    })
  })
})
