import React, { useState } from 'react'

import { JokeSkeleton, JokeTitle, TtsButton } from './elements'
import Admin from '@components/admin'
import { baseUrl } from '@config/amplify'
import { JokeType } from '@types'

export interface JokeProps {
  addJoke: (newJoke: JokeType) => Promise<string>
  id?: string
  joke?: JokeType
  updateJoke: (joke: JokeType) => Promise<void>
}

const Joke = ({ addJoke, id, joke, updateJoke }: JokeProps): React.ReactNode => {
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  const ttsClick = async (jokeId: string): Promise<void> => {
    setIsAudioLoading(true)
    const ttsUrl = joke?.audio
      ? `data:${joke.audio.contentType};base64,${joke.audio.base64}`
      : `${baseUrl}/jokes/${jokeId}/tts`
    const audio = new Audio(ttsUrl)
    audio.addEventListener('canplaythrough', () => {
      audio.play()
    })
    audio.addEventListener('ended', () => {
      setIsAudioLoading(false)
    })
    audio.addEventListener('error', (error) => {
      console.error('Error playing audio', { error })
      setIsAudioLoading(false)
    })
  }

  return (
    <>
      <JokeTitle key={joke ? 'loaded' : 'loading'}>{joke?.contents ?? <JokeSkeleton />}</JokeTitle>
      <div className="flex justify-center py-8">
        <TtsButton
          isDisabled={joke === undefined || isAudioLoading}
          isLoading={isAudioLoading}
          onPress={() => id && ttsClick(id)}
        />
      </div>
      {!!id && joke && <Admin addJoke={addJoke} id={id} joke={joke} updateJoke={updateJoke} />}
    </>
  )
}

export default Joke
