import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import Joke from '@components/joke'

const Humor = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Humor | dbowland.com</title>
      </Helmet>
      <Grid style={{ padding: '50px' }}>
        <div style={{ margin: 'auto', maxWidth: '900px' }}>
          <Joke initialize={typeof window !== 'undefined'} />
        </div>
      </Grid>
    </>
  )
}

export default Humor
