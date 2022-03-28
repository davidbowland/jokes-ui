import { Helmet } from 'react-helmet'
import Paper from '@mui/material/Paper'
import React from 'react'

import Joke from '@components/joke'
import Themed from '@components/themed'

import '@assets/css/index.css'
import '@fontsource/rokkitt'

const Humor = (): JSX.Element => {
  return (
    <Themed>
      <Paper elevation={3} sx={{ margin: '1em auto', maxWidth: '900px' }}>
        <main className="main-content">
          <Helmet>
            <title>Humor | dbowland.com</title>
          </Helmet>
          <Joke initialize={typeof window !== 'undefined'} />
        </main>
      </Paper>
    </Themed>
  )
}

export default Humor
