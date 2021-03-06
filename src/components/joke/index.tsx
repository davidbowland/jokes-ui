import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import CampaignIcon from '@mui/icons-material/Campaign'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { DisplayedJoke, JokeResponse } from '@types'
import Admin from '@components/admin'
import { baseUrl } from '@config/amplify'
import { getRandomJokes } from '@services/jokes'

export interface JokeProps {
  initialize?: boolean
}

const Joke = ({ initialize = false }: JokeProps): JSX.Element => {
  const [joke, setJoke] = useState(undefined as DisplayedJoke | undefined)
  const [availableJokes, setAvailableJokes] = useState([] as JokeResponse[])
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [recentIndexes, setRecentIndexes] = useState([] as string[])
  const jokeList = Object.keys(availableJokes) as unknown as number[]
  const isLoading = jokeList.length == 0 || !joke

  const fetchJokeList = async (): Promise<void> => {
    try {
      setIsError(false)
      const fetchedJokes = await getRandomJokes(recentIndexes)
      setAvailableJokes(fetchedJokes)
      setRecentIndexes(fetchedJokes.map((item) => item.id.toString()))
    } catch (error) {
      setIsError(true)
      console.error(error)
    }
  }

  const getButtonText = (): string => {
    if (isError) {
      return 'Error! Try again.'
    } else if (isLoading) {
      return 'Loading...'
    }
    return 'Next joke'
  }

  const getRandomJoke = (): DisplayedJoke => {
    const [selectedJoke, ...newAvailableJokes] = availableJokes
    setAvailableJokes(newAvailableJokes)
    return { ...selectedJoke.data, index: selectedJoke.id }
  }

  const setNextJoke = async (): Promise<void> => {
    if (jokeList.length === 0) {
      fetchJokeList()
    } else {
      const nextJoke = getRandomJoke()
      setJoke(nextJoke)
    }
  }

  const ttsClick = async (): Promise<void> => {
    setIsAudioLoading(true)
    const audio = new Audio(`${baseUrl}/jokes/${joke?.index}/tts`)
    audio.addEventListener('canplaythrough', () => {
      audio.play()
    })
    audio.addEventListener('ended', () => {
      setIsAudioLoading(false)
    })
    audio.addEventListener('error', () => {
      setIsAudioLoading(false)
    })
  }

  useEffect((): void => {
    if (jokeList.length == 0 && (initialize || joke !== undefined)) {
      fetchJokeList()
    } else if (joke === undefined && jokeList.length > 0) {
      setNextJoke()
    }
  }, [availableJokes, joke])

  return (
    <Stack margin="auto" spacing={2}>
      <Typography minHeight={'2.5em'} variant="h4">
        {joke?.contents ?? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          color="secondary"
          data-amplify-analytics-name="text-to-speech-click"
          data-amplify-analytics-on="click"
          disabled={joke === undefined || isAudioLoading}
          endIcon={isAudioLoading ? <CircularProgress color="inherit" size={14} /> : <CampaignIcon />}
          onClick={ttsClick}
          variant="contained"
        >
          {isAudioLoading ? 'Fetching audio' : 'Text-to-speech'}
        </Button>
        <Button
          color={isError ? 'error' : 'primary'}
          data-amplify-analytics-name="next-joke-click"
          data-amplify-analytics-on="click"
          disabled={isLoading && !isError}
          onClick={setNextJoke}
          startIcon={isLoading ? <CircularProgress color="inherit" size={14} /> : null}
          variant="contained"
        >
          {getButtonText()}
        </Button>
      </Stack>
      <Admin joke={joke} setJoke={setJoke} />
    </Stack>
  )
}

export default Joke
