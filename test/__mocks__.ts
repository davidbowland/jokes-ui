import { AuthUser } from 'aws-amplify/auth'

import { DisplayedJoke, JokeResponse, JokeType } from '@types'

export const displayedJoke: DisplayedJoke = {
  index: 'qp8pzhqc',
  contents: 'LOL',
}

export const initialJoke = { contents: displayedJoke.contents }

export const index = 'qp8pzhqc'

export const jokeResponse: JokeResponse[] = [
  { data: { contents: displayedJoke.contents }, id: displayedJoke.index },
  { data: { contents: 'ROFL' }, id: 'abc33def' },
]

export const jokeType: JokeType = {
  audio: { base64: 'yalp', contentType: 'text/plain' },
  contents: 'LAWLS',
}

export const user: AuthUser = {
  userId: '178300fb-3ab6-41e2-bab6-231964026e42',
  username: '178300fb-3ab6-41e2-bab6-231964026e42',
  signInDetails: {
    authFlowType: 'USER_SRP_AUTH',
    loginId: 'dave',
  },
}
