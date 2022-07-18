export { RemoveOperation } from 'fast-json-patch'
export { Theme } from '@mui/material/styles'

export interface JokeAudio {
  contentType: string
  data: string
}

export interface JokeType {
  audio?: JokeAudio
  contents: string
}

export interface DisplayedJoke extends JokeType {
  index: number
}

export interface JokeResponse {
  data: JokeType
  id: number
}
