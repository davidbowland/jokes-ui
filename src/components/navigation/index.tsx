import { navigate } from 'gatsby'
import React, { useEffect } from 'react'

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

import Joke from '@components/joke'
import { useJoke } from '@hooks/useJoke'

export interface NavigationProps {
  initialCount?: number
  initialIndex?: number
}

const Navigation = ({ initialCount, initialIndex }: NavigationProps): React.ReactNode => {
  const {
    addJoke,
    errorMessage,
    getTtsUrl,
    hasNextJoke,
    hasPreviousJoke,
    index,
    joke,
    nextJoke,
    nextRandomJoke,
    previousJoke,
    resetErrorMessage,
    updateJoke,
  } = useJoke(initialIndex, initialCount)

  useEffect(() => {
    navigate(`/j/${index}`)
  }, [index])

  return (
    <Paper elevation={6} sx={{ p: { sm: '25px', xs: '15px' } }}>
      <Stack spacing={2}>
        <Joke addJoke={addJoke} getTtsUrl={getTtsUrl} index={index} joke={joke} key={index} updateJoke={updateJoke} />
        {joke && (
          <Grid container justifyContent="center" sx={{ textAlign: 'center' }}>
            <Grid item sm xs={12}></Grid>
            <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
              {hasPreviousJoke && (
                <Tooltip title="Previous joke">
                  <IconButton aria-label="Previous joke" onClick={previousJoke} sx={{ marginTop: '0.15em' }}>
                    <NavigateBeforeIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
              <Tooltip title="Random joke">
                <IconButton aria-label="Random joke" onClick={nextRandomJoke} sx={{ marginTop: '0.15em' }}>
                  <ShuffleIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item md={1} sm={2} sx={{ p: '0.5em' }} xs>
              {hasNextJoke && (
                <Tooltip title="Next joke">
                  <IconButton aria-label="Next joke" onClick={nextJoke} sx={{ marginTop: '0.15em' }}>
                    <NavigateNextIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item sm xs={12}></Grid>
          </Grid>
        )}
        <Snackbar autoHideDuration={15_000} onClose={resetErrorMessage} open={errorMessage !== undefined}>
          <Alert onClose={resetErrorMessage} severity="error" variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Paper>
  )
}

export default Navigation
