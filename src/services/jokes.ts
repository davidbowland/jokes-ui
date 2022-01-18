import Amplify, { API, Auth } from 'aws-amplify'

const appClientId = process.env.COGNITO_APP_CLIENT_ID
const userPoolId = process.env.COGNITO_USER_POOL_ID
const baseUrl = process.env.JOKE_API_BASE_URL
const fetchCount = process.env.JOKE_API_FETCH_COUNT

const apiName = 'JokesAPIGateway'
const apiNameUnauthenticated = 'JokesAPIGatewayUnauthenticated'

Amplify.configure({
  Auth: {
    region: userPoolId.split('_')[0],
    userPoolId,
    userPoolWebClientId: appClientId,
    mandatorySignIn: false,
  },
  API: {
    endpoints: [
      {
        name: apiName,
        endpoint: baseUrl,
        custom_header: async () => ({
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        }),
      },
      {
        name: apiNameUnauthenticated,
        endpoint: baseUrl,
      },
    ],
  },
})

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
    const response: JokeType = await API.get(apiName, `/v1/jokes/${index}`, {})
    return response
  }

  static async postJoke(joke: JokeType): Promise<PostResponse> {
    const response: PostResponse = await API.post(apiName, '/v1/jokes', {
      body: joke,
    })
    return response
  }

  static async putJoke(index: number, joke: JokeType): Promise<string> {
    const response: string = await API.put(apiName, `/v1/jokes/${index}`, {
      body: joke,
    })
    return response
  }

  static async getRandomJokes(): Promise<JokeResponse> {
    const response: JokeResponse = await API.get(apiNameUnauthenticated, '/v1/jokes/random', {
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
