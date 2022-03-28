export { Theme } from '@mui/material/styles'

export interface JokeType {
  contents: string
}

export interface DisplayedJoke extends JokeType {
  index: number
}

export interface JokeResponse {
  data: JokeType
  id: number
}
