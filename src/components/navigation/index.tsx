import Joke from '@components/joke'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { getInitialData, getJokeCount } from '@services/jokes'
import { JokeType } from '@types'
import { navigate } from 'gatsby'
import React, { useEffect, useState } from 'react'

export interface NavigationProps {
  initialIndex?: number
}

const Navigation = ({ initialIndex }: NavigationProps): JSX.Element => {
  const [count, setCount] = useState((typeof window !== 'undefined' && window?.history?.state?.count) || 0)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [index, setIndex] = useState<number | undefined>(initialIndex)
  const [initialJoke, setInitialJoke] = useState<JokeType | undefined>()
  const [recentIndexes, setRecentIndexes] = useState<number[]>(index ? [index] : [])

  const addJoke = (index: number): void => {
    setCount(index)
    setIndex(index)
    setInitialJoke(undefined)
    setRecentIndexes((recent) => [...recent, index])
  }

  const fetchCount = async (): Promise<void> => {
    try {
      const jokeCount = await getJokeCount()
      setCount(jokeCount.count)
    } catch (error) {
      console.error('Error fetching joke count', { error })
      setErrorMessage('Error fetching joke count. Please reload to try again.')
    }
  }

  const fetchInitialData = async (): Promise<void> => {
    try {
      const initialData = await getInitialData()
      setCount(initialData.count)
      setIndex(initialData.joke.id)
      setInitialJoke(initialData.joke.data)

      // Update the URL to reflect the URL of this joke
      navigate(`/j/${initialData.joke.id}`, { replace: true, state: { count: initialData.count } })
    } catch (error) {
      console.error('Error fetching initial joke data', { error })
      setErrorMessage('Error fetching initial joke data. Please reload to try again.')
    }
  }

  const navigateToIndex = (index: number): void => {
    navigate(`/j/${index}`, { state: { count } })
    setIndex(index)
    setRecentIndexes((recent) => [...recent, index])
    setInitialJoke(undefined)
  }

  const randomJokeClick = (count: number): void => {
    const choices = Array.from({ length: count })
      .map((_, index) => index + 1)
      .filter((value) => recentIndexes.indexOf(value) < 0)
    if (choices.length > 0) {
      const randomIndex = choices[Math.floor(choices.length * Math.random())]
      navigateToIndex(randomIndex)
    } else {
      const randomIndex = Math.floor(count * Math.random()) + 1
      navigateToIndex(randomIndex)
      setRecentIndexes([randomIndex])
    }
  }

  const snackbarErrorClose = (): void => {
    setErrorMessage(undefined)
  }

  useEffect(() => {
    if (count === 0) {
      if (index === undefined) {
        fetchInitialData()
      } else {
        fetchCount()
      }
    }
  }, [count])

  return (
    <Paper elevation={6} sx={{ p: { sm: '25px', xs: '15px' } }}>
      <Stack spacing={2}>
        <Joke addJoke={addJoke} index={index} initialJoke={initialJoke} key={index} />
        {count > 0 && (
          <Grid container justifyContent="center" sx={{ textAlign: 'center' }}>
            <Grid item sm xs={12}></Grid>
            <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
              {index && index > 1 && (
                <Tooltip title="Previous joke">
                  <IconButton
                    aria-label="Previous joke"
                    onClick={() => navigateToIndex(index - 1)}
                    sx={{ marginTop: '0.15em' }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
              <Tooltip title="Random joke">
                <IconButton
                  aria-label="Random joke"
                  onClick={() => randomJokeClick(count)}
                  sx={{ marginTop: '0.15em' }}
                >
                  <ShuffleIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
              {index && index < count && (
                <Tooltip title="Next joke">
                  <IconButton
                    aria-label="Next joke"
                    onClick={() => navigateToIndex(index + 1)}
                    sx={{ marginTop: '0.15em' }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item sm xs={12}></Grid>
          </Grid>
        )}
        <Snackbar autoHideDuration={15_000} onClose={snackbarErrorClose} open={errorMessage !== undefined}>
          <Alert onClose={snackbarErrorClose} severity="error" variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Paper>
  )
}

export default Navigation
