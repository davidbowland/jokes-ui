import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'

import Admin from '@components/admin'
import { getRandomJokes } from '@services/jokes'
import { DisplayedJoke, JokeResponse } from '@types'

export interface JokeProps {
  initialize?: boolean
}

const Joke = ({ initialize = false }: JokeProps): JSX.Element => {
  const [joke, setJoke] = useState(undefined as DisplayedJoke | undefined)
  const [availableJokes, setAvailableJokes] = useState({} as JokeResponse)
  const [isError, setIsError] = useState(false)
  const [recentIndexes, setRecentIndexes] = useState([] as string[])
  const jokeList = (Object.keys(availableJokes) as unknown) as number[]
  const isLoading = jokeList.length == 0 || !joke

  const fetchJokeList = async (): Promise<void> => {
    try {
      setIsError(false)
      const fetchedJokes = await getRandomJokes(recentIndexes)
      setAvailableJokes(fetchedJokes)
      setRecentIndexes(Object.keys(fetchedJokes))
    } catch (error) {
      setIsError(true)
      console.error(error)
    }
  }

  const getRandomJoke = (): DisplayedJoke => {
    const randomIndex = jokeList[Math.floor(Math.random() * jokeList.length)]
    const selectedJoke = availableJokes[randomIndex]
    const { [randomIndex]: _, ...newAvailableJokes } = availableJokes
    setAvailableJokes(newAvailableJokes)

    return { ...selectedJoke, index: randomIndex }
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
    </>
  )
}

export default Joke
