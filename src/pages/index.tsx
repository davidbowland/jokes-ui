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
      <Grid container justifyContent="center" sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item xs>
          <Joke initialize={typeof window !== 'undefined'} />
        </Grid>
      </Grid>
    </>
  )
}

export default Humor
