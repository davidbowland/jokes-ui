import { Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { Operation as PatchOperation } from 'fast-json-patch'

import { getInitialData, getJoke, getJokeCount, getRandomJokes, patchJoke, postJoke } from './jokes'
import { http, HttpResponse, server } from '@test/setup-server'
import { initialResponse } from '@test/__mocks__'
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

  describe('getInitialData', () => {
    beforeAll(() => {
      server.use(
        http.get(`${baseUrl}/jokes/initial`, async () => {
          return HttpResponse.json(initialResponse)
        })
      )
    })

    test('Expect results from initial endpoint', async () => {
      const result = await getInitialData()
      expect(result).toEqual(initialResponse)
    })
  })

  describe('getJoke', () => {
    beforeAll(() => {
      server.use(
        http.get(`${baseUrl}/jokes/:id`, async ({ params }) => {
          const { id } = params as { id: string }
          if (!(id in randomJokeResult)) {
            return new HttpResponse(null, { status: 404 })
          }
          return HttpResponse.json(randomJokeResult[id as unknown as number])
        })
      )
    })

    test.each(Object.keys(randomJokeResult) as unknown as number[])(
      'Expect results from joke endpoint',
      async (expectedId: number) => {
        const result = await getJoke(expectedId)
        expect(result).toEqual(randomJokeResult[expectedId])
      }
    )
  })

  describe('getJokeCount', () => {
    const count = 42

    beforeAll(() => {
      server.use(
        http.get(`${baseUrl}/jokes/count`, async () => {
          return HttpResponse.json({ count })
        })
      )
    })

    test('Expect results from count endpoint', async () => {
      const result = await getJokeCount()
      expect(result).toEqual({ count })
    })
  })

  describe('getRandomJokes', () => {
    const recentIndexes = ['32', '45', '79']

    beforeAll(() => {
      server.use(
        http.get(`${baseUrl}/jokes/random`, async ({ request }) => {
          const url = new URL(request.url)
          if (recentIndexes.join(',') !== url.searchParams.get('avoid')) {
            return new HttpResponse(null, { status: 400 })
          }
          return HttpResponse.json(randomJokeResult)
        })
      )
    })

    test('expect results using recentIndexes', async () => {
      const result = await getRandomJokes(recentIndexes)

      expect(result).toEqual(randomJokeResult)
    })
  })

  describe('postJoke', () => {
    const postEndpoint = jest.fn().mockReturnValue(200)
    const joke = Object.values(randomJokeResult)[0].data

    beforeAll(() => {
      server.use(
        http.post(`${baseUrl}/jokes`, async ({ request }) => {
          const body = postEndpoint(await request.json())
          return body ? HttpResponse.json(body) : HttpResponse.json(null, { status: 400 })
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
        http.patch(`${baseUrl}/jokes/:id`, async ({ params, request }) => {
          const { id } = params
          const body = patchEndpoint(id, await request.json())
          return body ? HttpResponse.json(body) : HttpResponse.json(null, { status: 400 })
        })
      )
    })

    test('expect endpoint called with index and patch operation', async () => {
      await patchJoke(index, operation)
      expect(patchEndpoint).toHaveBeenCalledTimes(1)
      expect(patchEndpoint).toHaveBeenCalledWith(index, operation)
    })
  })
})
