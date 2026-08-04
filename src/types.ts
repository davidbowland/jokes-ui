export type { Operation as PatchOperation } from 'fast-json-patch'

export interface JokeAudio {
  base64: string
  // Polly's SynthesizeSpeech response declares ContentType as optional, so jokes-api can serve
  // this absent. Kept in step with JokeAudio in jokes-api/src/types.ts — the two declare the
  // same wire contract and must agree.
  contentType?: string
  version?: string
}

export interface JokeType {
  audio?: JokeAudio
  contents: string
}

export interface DisplayedJoke extends JokeType {
  index: string
}

export interface JokeResponse {
  data: JokeType
  id: string
}

export interface PostResponse {
  contents: string
  id: string
}
