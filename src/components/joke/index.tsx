import Admin from '@components/admin'
import { JokeType } from '@types'
import React, { useState } from 'react'

import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

export interface JokeProps {
  addJoke: (newJoke: JokeType) => Promise<number>
  getTtsUrl: (index: number) => string
  joke?: JokeType
  index?: number
  updateJoke: (joke: JokeType, indexOverride?: number) => Promise<void>
}

const Joke = ({ addJoke, getTtsUrl, index, joke, updateJoke }: JokeProps): React.ReactNode => {
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
      <Typography minHeight={'2.5em'} variant="h4">
        {joke?.contents ?? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton sx={{ display: { md: 'none', xs: 'initial' } }} />
            <Skeleton sx={{ display: { sm: 'none', xs: 'initial' } }} />
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
      {index && joke && <Admin addJoke={addJoke} index={index} joke={joke} updateJoke={updateJoke} />}
    </>
  )
}

export default Joke
