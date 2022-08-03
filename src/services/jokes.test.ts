import { Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { Operation as PatchOperation } from 'fast-json-patch'

import { getJoke, getRandomJokes, patchJoke, postJoke } from './jokes'
import { rest, server } from '@test/setup-server'
import { JokeResponse } from '@types'

const baseUrl = process.env.GATSBY_JOKE_API_BASE_URL
jest.mock('@aws-amplify/analytics')

describe('Joke service', () => {
  const randomJokeResult: JokeResponse[] = [
    { data: { contents: 'rofl' }, id: 3 },
    { data: { contents: 'lol' }, id: 74 },
  ]

  beforeAll(() => {
    const userSession = { getIdToken: () => ({ getJwtToken: () => '' }) } as CognitoUserSession
    jest.spyOn(Auth, 'currentSession').mockResolvedValue(userSession)
  })

  describe('getJoke', () => {
    beforeAll(() => {
      server.use(
        rest.get(`${baseUrl}/jokes/:id`, async (req, res, ctx) => {
          const { id } = req.params as { id: string }
          if (!(id in randomJokeResult)) {
            return res(ctx.status(400))
          }
          return res(ctx.json(randomJokeResult[id as unknown as number]))
        })
      )
    })

    test.each(Object.keys(randomJokeResult) as unknown as number[])(
      'Expect results from client endpoint',
      async (expectedId: number) => {
        const result = await getJoke(expectedId)
        expect(result).toEqual(randomJokeResult[expectedId])
      }
    )
  })

  describe('postJoke', () => {
    const postEndpoint = jest.fn().mockReturnValue(200)
    const joke = Object.values(randomJokeResult)[0].data

    beforeAll(() => {
      server.use(
        rest.post(`${baseUrl}/jokes`, async (req, res, ctx) => {
          const body = postEndpoint(await req.json())
          return res(body ? ctx.json(body) : ctx.status(400))
        })
      )
    })

    test('expect endpoint called with joke', async () => {
      await postJoke(joke)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(postEndpoint).toHaveBeenCalledWith(joke)
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
    const patchEndpoint = jest.fn().mockReturnValue(200)
    const index = Object.keys(randomJokeResult)[0] as unknown as number
    const operation = [
      {
        op: 'add',
        path: '/foo',
        value: 'bar',
      },
    ] as unknown as PatchOperation[]

    beforeAll(() => {
      server.use(
        rest.patch(`${baseUrl}/jokes/:id`, async (req, res, ctx) => {
          const { id } = req.params
          const body = patchEndpoint(id, await req.json())
          return res(body ? ctx.json(body) : ctx.status(400))
        })
      )
    })

    test('expect endpoint called with index and patch operation', async () => {
      await patchJoke(index, operation)
      expect(patchEndpoint).toHaveBeenCalledTimes(1)
      expect(patchEndpoint).toHaveBeenCalledWith(index, operation)
    })
  })

  describe('getRandomJokes', () => {
    const recentIndexes = ['32', '45', '79']

    beforeAll(() => {
      server.use(
        rest.get(`${baseUrl}/jokes/random`, async (req, res, ctx) => {
          if (recentIndexes.join(',') !== req.url.searchParams.get('avoid')) {
            return res(ctx.status(400))
          }
          return res(ctx.json(randomJokeResult))
        })
      )
    })

    test('expect results using recentIndexes', async () => {
      const result = await getRandomJokes(recentIndexes)

      expect(result).toEqual(randomJokeResult)
    })
  })
})
