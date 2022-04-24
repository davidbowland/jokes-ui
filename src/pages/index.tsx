import { Helmet } from 'react-helmet'
import Paper from '@mui/material/Paper'
import React from 'react'

import Authenticated from '@components/auth'
import Joke from '@components/joke'
import Themed from '@components/themed'

const Humor = (): JSX.Element => {
  return (
    <Themed>
      <Helmet>
        <title>Humor | dbowland.com</title>
      </Helmet>
      <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '900px' }}>
        <Authenticated>
          <main className="main-content">
            <Joke initialize={typeof window !== 'undefined'} />
          </main>
        </Authenticated>
      </Paper>
    </Themed>
  )
}

export default Humor
