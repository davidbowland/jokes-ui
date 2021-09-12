import { Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'

import JokeService, { JokeResponse } from './jokes'
import { rest, server } from '@test/setup-server'

const baseUrl = process.env.JOKE_API_BASE_URL || 'http://localhost'

describe('Joke service', () => {
  const randomJokeResult: JokeResponse = { 3: { joke: 'rofl' }, 74: { joke: 'lol' } }

  beforeAll(() => {
    const userSession = { getIdToken: () => ({ getJwtToken: () => '' }) } as CognitoUserSession
    jest.spyOn(Auth, 'currentSession').mockResolvedValue(userSession)
  })

  describe('getJoke', () => {
    beforeAll(() => {
      server.use(
        rest.get(`${baseUrl}/v1/jokes/:id`, async (req, res, ctx) => {
          const { id } = req.params
          if (!(id in randomJokeResult)) {
            return res(ctx.status(400))
          }
          return res(ctx.json(randomJokeResult[id]))
        })
      )
    })

    test.each((Object.keys(randomJokeResult) as unknown) as number[])(
      'Expect results from client endpoint',
      async (expectedId: number) => {
        const result = await JokeService.getJoke(expectedId)
        expect(result).toEqual(randomJokeResult[expectedId])
      }
    )
  })

  describe('postJoke', () => {
    const postEndpoint = jest.fn().mockReturnValue(200)
    const joke = Object.values(randomJokeResult)[0]

    beforeAll(() => {
      server.use(
        rest.post(`${baseUrl}/v1/jokes`, async (req, res, ctx) => {
          const body = postEndpoint(req.body)
          return res(body ? ctx.json(body) : ctx.status(400))
        })
      )
    })

    test('Expect endpoint called with joke', async () => {
      await JokeService.postJoke(joke)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(postEndpoint).toHaveBeenCalledWith(joke)
    })

    test('Expect result from call returned', async () => {
      const expectedResult = { id: '148' }
      postEndpoint.mockReturnValue(expectedResult)

      const result = await JokeService.postJoke(joke)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('putJoke', () => {
    const putEndpoint = jest.fn().mockReturnValue(200)
    const index = (Object.keys(randomJokeResult)[0] as unknown) as number
    const joke = Object.values(randomJokeResult)[0]

    beforeAll(() => {
      server.use(
        rest.put(`${baseUrl}/v1/jokes/:id`, async (req, res, ctx) => {
          const { id } = req.params
          const body = putEndpoint(id, req.body)
          return res(body ? ctx.json(body) : ctx.status(400))
        })
      )
    })

    test('Expect endpoint called with index and joke', async () => {
      await JokeService.putJoke(index, joke)
      expect(putEndpoint).toHaveBeenCalledTimes(1)
      expect(putEndpoint).toHaveBeenCalledWith(index, joke)
    })
  })

  describe('getRandomJokes', () => {
    beforeAll(() => {
      server.use(
        rest.get(`${baseUrl}/v1/jokes/random`, async (req, res, ctx) => {
          if (JokeService.recentIndexes.join(',') !== req.url.searchParams.get('avoid')) {
            return res(ctx.status(400))
          }
          return res(ctx.json(randomJokeResult))
        })
      )
    })

    test('Expect results from client endpoint', async () => {
      const result = await JokeService.getRandomJokes()

      expect(JokeService.recentIndexes).toEqual(Object.keys(randomJokeResult))
      expect(result).toEqual(randomJokeResult)
    })

    test('Expect results using recentIndexes', async () => {
      JokeService.recentIndexes = [32, 45, 79]
      const result = await JokeService.getRandomJokes()

      expect(JokeService.recentIndexes).toEqual(Object.keys(randomJokeResult))
      expect(result).toEqual(randomJokeResult)
    })
  })
})
