/* eslint-disable sort-keys */
import { AmplifyUser } from '@aws-amplify/ui'

import { DisplayedJoke, InitialResponse, JokeCount, JokeResponse, JokeType } from '@types'

export const displayedJoke: DisplayedJoke = {
  index: 42,
  contents: 'LOL',
}

export const initialJoke = { contents: displayedJoke.contents }

export const index = 42

export const jokeCount: JokeCount = {
  count: 128,
}

export const initialResponse: InitialResponse = {
  ...jokeCount,
  joke: { data: initialJoke, id: displayedJoke.index },
}

export const jokeResponse: JokeResponse[] = [
  { data: { contents: displayedJoke.contents }, id: displayedJoke.index },
  { data: { contents: 'ROFL' }, id: 33 },
]

export const jokeType: JokeType = {
  audio: { base64: 'yalp', contentType: 'text/plain' },
  contents: 'LAWLS',
}

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
