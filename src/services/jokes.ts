import { API } from 'aws-amplify'
import { apiName, apiNameUnauthenticated } from '@config/amplify'
import { Operation as PatchOperation } from 'fast-json-patch'

const fetchCount = process.env.GATSBY_JOKE_API_FETCH_COUNT

export interface JokeType {
  contents: string
}

export interface JokeResponse {
  [key: number]: JokeType
}

export interface PostResponse {
  index: string
}

export class JokeService {
  static recentIndexes: number[] = []

  static async getJoke(index: number): Promise<JokeType> {
    const response: JokeType = await API.get(apiName, `/jokes/${index}`, {})
    return response
  }

  static async postJoke(joke: JokeType): Promise<PostResponse> {
    const response: PostResponse = await API.post(apiName, '/jokes', {
      body: joke,
    })
    return response
  }

  static async patchJoke(index: number, operations: PatchOperation[]): Promise<string> {
    const response: string = await API.patch(apiName, `/jokes/${index}`, {
      body: operations,
    })
    return response
  }

  static async getRandomJokes(): Promise<JokeResponse> {
    const response: JokeResponse = await API.get(apiNameUnauthenticated, '/jokes/random', {
      queryStringParameters: {
        count: fetchCount,
        avoid: JokeService.recentIndexes.join(','),
      },
    })
    JokeService.recentIndexes = (Object.keys(response) as unknown) as number[]
    return response
  }
}

export default JokeService
