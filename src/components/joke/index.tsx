import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff'
import Typography from '@mui/material/Typography'

import Admin from '@components/admin'
import { baseUrl } from '@config/amplify'
import { getJoke } from '@services/jokes'
import { JokeType } from '@types'

export interface JokeProps {
  addJoke: (index: number) => void
  index?: number
  initialJoke?: JokeType
}

const Joke = ({ addJoke, index, initialJoke }: JokeProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  const client = useQueryClient()
  const {
    data: joke,
    error,
    isLoadingError,
  } = useQuery<JokeType | null>(
    {
      initialData: initialJoke,
      queryFn: () => (index ? getJoke(index) : null),
      queryKey: [index],
    },
    client
  )

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

  const setJoke = (joke: JokeType, targetIndex?: number): void => {
    if (targetIndex === undefined) {
      client.setQueryData<JokeType>([index], joke)
    } else {
      addJoke(targetIndex)
      client.setQueryData<JokeType>([targetIndex], joke)
    }
  }

  const snackbarErrorClose = (): void => {
    setErrorMessage(undefined)
  }

  useEffect(() => {
    if (isLoadingError) {
      console.error(error)
      setErrorMessage('Error fetching joke. Please reload to try again.')
    }
  }, [error, isLoadingError])

  return (
    <>
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
      {index && joke && <Admin index={index} joke={joke} setJoke={setJoke} />}
      <Snackbar autoHideDuration={15_000} onClose={snackbarErrorClose} open={errorMessage !== undefined}>
        <Alert onClose={snackbarErrorClose} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Joke
