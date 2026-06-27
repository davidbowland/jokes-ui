import React, { useState } from 'react'

import { JokeCounter, JokeSkeleton, JokeTitle, TtsButton } from './elements'
import Admin from '@components/admin'
import { baseUrl } from '@config/amplify'
import { JokeType } from '@types'

export interface JokeProps {
  addJoke: (newJoke: JokeType) => Promise<string>
  count?: number
  index?: string
  joke?: JokeType
  updateJoke: (joke: JokeType) => Promise<void>
}

const Joke = ({ addJoke, count, index, joke, updateJoke }: JokeProps): React.ReactNode => {
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  const ttsClick = async (): Promise<void> => {
    setIsAudioLoading(true)
    const ttsUrl = joke?.audio
      ? `data:${joke.audio.contentType};base64,${joke.audio.base64}`
      : `${baseUrl}/jokes/${index}/tts`
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
    <div className="flex flex-col items-center gap-8">
      <div className="flex h-8 items-center">{index && count ? <JokeCounter count={count} index={index} /> : null}</div>
      <JokeTitle key={joke ? 'loaded' : 'loading'}>{joke?.contents ?? <JokeSkeleton />}</JokeTitle>
      <div className="flex justify-center py-2">
        <TtsButton
          isDisabled={joke === undefined || isAudioLoading}
          isLoading={isAudioLoading}
          onPress={() => index && ttsClick()}
        />
      </div>
      {!!index && joke && (
        <div className="w-full">
          <Admin addJoke={addJoke} index={index} joke={joke} updateJoke={updateJoke} />
        </div>
      )}
    </div>
  )
}

export default Joke
