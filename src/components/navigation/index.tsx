import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'

import { getJokeCount } from '@services/jokes'
import { navigate } from 'gatsby'

export interface NavigationProps {
  index?: number
}

const Navigation = ({ index }: NavigationProps): JSX.Element => {
  const [count, setCount] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [recentIndexes, setRecentIndexes] = useState<number[]>(index ? [index] : [])

  const nextJokeClick = (index: number): void => {
    navigate(`/j/${index + 1}`)
    setRecentIndexes([...recentIndexes, index + 1])
  }

  const previousJokeClick = (index: number): void => {
    navigate(`/j/${index - 1}`)
    setRecentIndexes([...recentIndexes, index - 1])
  }

  const randomJokeClick = (): void => {
    const choices = Array.from({ length: count })
      .map((_, index) => index + 1)
      .filter((value) => recentIndexes.indexOf(value) < 0)
    if (choices.length > 0) {
      const randomIndex = choices[Math.floor(choices.length * Math.random())]
      navigate(`/j/${randomIndex}`)
      setRecentIndexes([...recentIndexes, randomIndex])
    } else {
      const randomIndex = Math.floor(Math.random() * count) + 1
      navigate(`/j/${randomIndex}`)
      setRecentIndexes([randomIndex])
    }
  }

  const snackbarErrorClose = (): void => {
    setErrorMessage(undefined)
  }

  useEffect(() => {
    if (count && index === undefined) {
      randomJokeClick()
    }
  }, [count])

  useEffect(() => {
    getJokeCount()
      .then((result) => setCount(result.count))
      .catch((error) => {
        console.error(error)
        setErrorMessage('Error fetching joke navigation. Please refresh the page to try again.')
      })
  }, [])

  return (
    <>
      {count > 0 && index && (
        <Grid container justifyContent="center" sx={{ textAlign: 'center' }}>
          <Grid item sm xs={12}></Grid>
          <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
            {index > 1 && (
              <Tooltip title="Previous joke">
                <IconButton
                  aria-label="Previous joke"
                  onClick={() => previousJokeClick(index)}
                  sx={{ marginTop: '0.15em' }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
            <Tooltip title="Random joke">
              <IconButton aria-label="Random joke" onClick={randomJokeClick} sx={{ marginTop: '0.15em' }}>
                <ShuffleIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
            {index < count && (
              <Tooltip title="Next joke">
                <IconButton aria-label="Next joke" onClick={() => nextJokeClick(index)} sx={{ marginTop: '0.15em' }}>
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
    </>
  )
}

export default Navigation
