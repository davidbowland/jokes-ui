import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import Admin from '@components/admin'
import { JokeType } from '@types'
import Navigation from '@components/navigation'
import { baseUrl } from '@config/amplify'
import { getJoke } from '@services/jokes'

export interface JokeProps {
  index?: number
}

const Joke = ({ index }: JokeProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [joke, setJoke] = useState<JokeType | undefined>(undefined)
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  const fetchJoke = async (index: number): Promise<void> => {
    try {
      const joke = await getJoke(index)
      setJoke(joke)
    } catch (error) {
      console.error(error)
      setErrorMessage('Error fetching joke. Please reload to try again.')
    }
  }

  const getTtsUrl = (index: number): string => {
    if (joke?.audio) {
      return `data:${joke.audio.contentType};base64,${joke.audio.data}`
    }
    return `${baseUrl}/jokes/${index}/tts`
  }

  const ttsClick = async (index: number): Promise<void> => {
    setIsAudioLoading(true)
    const audio = new Audio(getTtsUrl(index))
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

  const snackbarErrorClose = (): void => {
    setErrorMessage(undefined)
  }

  useEffect(() => {
    setJoke(undefined)
    if (index) {
      fetchJoke(index)
    }
  }, [index])

  return (
    <Paper elevation={6} sx={{ p: { sm: '25px', xs: '15px' } }}>
      <Stack spacing={2}>
        <Typography minHeight={'2.5em'} variant="h4">
          {joke?.contents ?? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
        </Typography>
        <Grid container justifyContent="center">
          <Grid item order={{ sm: 1, xs: 2 }} sm="auto" sx={{ p: '0.5em' }} xs={12}>
            <Button
              data-amplify-analytics-name="text-to-speech-click"
              data-amplify-analytics-on="click"
              disabled={joke === undefined || isAudioLoading}
              onClick={() => index && ttsClick(index)}
              startIcon={isAudioLoading ? <CircularProgress color="inherit" size={14} /> : <SpatialAudioOffIcon />}
              sx={{ width: { sm: 'auto', xs: '100%' } }}
              variant="outlined"
            >
              {isAudioLoading ? 'Fetching audio' : 'Text-to-speech'}
            </Button>
          </Grid>
        </Grid>
        {(joke?.contents || index === undefined) && <Navigation index={index} />}
        {index && joke && <Admin index={index} joke={joke} setJoke={setJoke} />}
        <Snackbar autoHideDuration={15_000} onClose={snackbarErrorClose} open={errorMessage !== undefined}>
          <Alert onClose={snackbarErrorClose} severity="error" variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Paper>
  )
}

export default Joke
