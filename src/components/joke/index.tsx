import React, { useState } from 'react'

import { JokeCounter, JokeSkeleton, JokeTitle, TtsButton } from './elements'
import Admin from '@components/admin'
import { JokeType } from '@types'

export interface JokeProps {
  addJoke: (newJoke: JokeType) => Promise<number>
  count?: number
  getTtsUrl: (index: number) => string
  index?: number
  joke?: JokeType
  updateJoke: (joke: JokeType, indexOverride?: number) => Promise<void>
}

const Joke = ({ addJoke, count, getTtsUrl, index, joke, updateJoke }: JokeProps): React.ReactNode => {
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  const ttsClick = async (index: number): Promise<void> => {
    setIsAudioLoading(true)
    const audio = new Audio(getTtsUrl(index))
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
      <div className="mb-6 h-4">{index && count ? <JokeCounter count={count} index={index} /> : null}</div>
      <JokeTitle key={joke ? 'loaded' : 'loading'}>{joke?.contents ?? <JokeSkeleton />}</JokeTitle>
      <div className="flex justify-center py-8">
        <TtsButton
          isDisabled={joke === undefined || isAudioLoading}
          isLoading={isAudioLoading}
          onPress={() => index && ttsClick(index)}
        />
      </div>
      {!!index && joke && <Admin addJoke={addJoke} index={index} joke={joke} updateJoke={updateJoke} />}
    </>
  )
}

export default Joke
