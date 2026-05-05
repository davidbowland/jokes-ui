/* eslint-disable sort-keys */
import { AmplifyUser } from '@aws-amplify/ui'

import { InitialResponse, JokeCount, JokeResponse, JokeType } from '@types'

export const jokeId = 'rnws6g7r'

export const jokeCount: JokeCount = {
  count: 128,
}

export const jokeType: JokeType = {
  audio: { base64: 'yalp', contentType: 'text/plain' },
  contents: 'LAWLS',
}

export const initialResponse: InitialResponse = {
  ...jokeCount,
  joke: { data: { contents: 'LOL' }, id: jokeId },
}

export const jokeResponse: JokeResponse[] = [
  { data: { contents: 'LOL' }, id: jokeId },
  { data: { contents: 'ROFL' }, id: '5xspzm6z' },
]

export const user: AmplifyUser = {
  username: '178300fb-3ab6-41e2-bab6-231964026e42',
  pool: {
    userPoolId: 'us-east-2_xqxzyIOz4',
    clientId: '135qlssf7st66v1vl5dtopfeks',
    client: { endpoint: 'https://cognito-idp.us-east-2.amazonaws.com/', fetchOptions: {} },
    advancedSecurityDataCollectionFlag: true,
    storage: {},
  },
  Session: null,
  client: { endpoint: 'https://cognito-idp.us-east-2.amazonaws.com/', fetchOptions: {} },
  signInUserSession: {
    idToken: {
      jwtToken: 'id-jwt',
    },
    refreshToken: {
      token: 'refresh-token',
    },
    accessToken: {
      jwtToken: 'access-token',
    },
    clockDrift: 0,
  },
  authenticationFlowType: 'USER_SRP_AUTH',
  storage: {},
  attributes: {
    sub: '178300fb-3ab6-41e2-bab6-231964026e42',
    name: 'Dave',
    phone_number_verified: 'true',
    phone_number: '+15551234567',
  },
  preferredMFA: 'NOMFA',
} as any
