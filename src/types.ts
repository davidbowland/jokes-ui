export interface JokeType {
  contents: string
}

export interface DisplayedJoke extends JokeType {
  index: number
}

export interface JokeResponse {
  [key: number]: JokeType
}
