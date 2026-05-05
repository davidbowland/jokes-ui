export type { Operation as PatchOperation } from 'fast-json-patch'

export interface JokeAudio {
  base64: string
  contentType: string
  version?: string
}

export interface JokeType {
  audio?: JokeAudio
  contents: string
}

export interface JokeResponse {
  data: JokeType
  id: string
}

export interface InitialResponse {
  joke: JokeResponse
}

export interface PostResponse {
  contents: string
  index: string
}
