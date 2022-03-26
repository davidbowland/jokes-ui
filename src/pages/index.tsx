import Container from '@mui/material/Container'
import { Helmet } from 'react-helmet'
import React from 'react'

import Joke from '@components/joke'

import '@assets/css/index.css'
import '@config/amplify'
import '@fontsource/rokkitt'
import 'normalize.css'

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
