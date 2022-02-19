import Analytics from '@aws-amplify/analytics'
import Container from '@mui/material/Container'
import React from 'react'
import { Helmet } from 'react-helmet'

import Joke from '@components/joke'

import '@fontsource/rokkitt'
import 'normalize.css'
import '@assets/css/index.css'

const appId = process.env.GATSBY_PINPOINT_ID

const analyticsConfig = {
  AWSPinpoint: {
    appId,
    region: 'us-east-1',
    mandatorySignIn: false,
  },
}

Analytics.configure(analyticsConfig)

Analytics.autoTrack('session', {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
})

Analytics.autoTrack('pageView', {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
})

Analytics.autoTrack('event', {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
})

const Humor = (): JSX.Element => {
  return (
    <Container maxWidth="md">
      <main className="main-content">
        <Helmet>
          <title>Humor | dbowland.com</title>
        </Helmet>
        <Joke initialize={typeof window !== 'undefined'} />
      </main>
    </Container>
  )
}

export default Humor
