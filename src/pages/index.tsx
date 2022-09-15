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
      <Grid sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Joke initialize={typeof window !== 'undefined'} />
      </Grid>
    </>
  )
}

export default Humor
