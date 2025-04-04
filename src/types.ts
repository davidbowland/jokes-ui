export { RemoveOperation } from 'fast-json-patch'
export { Theme } from '@mui/material/styles'

export interface JokeAudio {
  base64: string
  contentType: string
  version?: string
}

export interface JokeCount {
  count: number
}

export interface JokeType {
  audio?: JokeAudio
  contents: string
}

export interface DisplayedJoke extends JokeType {
  index: number
}

export interface InitialResponse extends JokeCount {
  joke: JokeResponse
}

export interface JokeResponse {
  data: JokeType
  id: number
}

export interface PostResponse {
  index: number
}
