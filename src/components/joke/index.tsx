import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useEffect, useState } from 'react'

import Admin from '@components/admin'
import { getRandomJokes } from '@services/jokes'
import { DisplayedJoke, JokeResponse } from '@types'

export interface JokeProps {
  initialize?: boolean
}

const Joke = ({ initialize = false }: JokeProps): JSX.Element => {
  const [joke, setJoke] = useState(undefined as DisplayedJoke | undefined)
  const [availableJokes, setAvailableJokes] = useState([] as JokeResponse[])
  const [isError, setIsError] = useState(false)
  const [recentIndexes, setRecentIndexes] = useState([] as string[])
  const jokeList = (Object.keys(availableJokes) as unknown) as number[]
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

  const getButtonText = (): string => {
    if (isError) {
      return 'Error! Try again.'
    } else if (isLoading) {
      return 'Loading...'
    }
    return 'Next joke'
  }

  useEffect(() => {
    if (jokeList.length == 0 && (initialize || joke !== undefined)) {
      fetchJokeList()
    } else if (joke === undefined && jokeList.length > 0) {
      setNextJoke()
    }
  }, [availableJokes, joke])

  return (
    <>
      <article className="joke">{joke?.contents ?? 'Fetching joke'}</article>
      <Button
        variant="contained"
        onClick={setNextJoke}
        disabled={isLoading && !isError}
        color={isError ? 'error' : 'primary'}
        data-amplify-analytics-on="click"
        data-amplify-analytics-name="next-joke-click"
      >
        {getButtonText()}
      </Button>
      <Admin joke={joke} setJoke={setJoke} />
      <Backdrop
        open={isLoading && !isError && !joke?.contents}
        sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default Joke
