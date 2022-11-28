import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import Joke from '@components/joke'
import PrivacyLink from '@components/privacy-link'

export interface JokePageProps {
  params: {
    index: string
  }
}

const JokePage = ({ params }: JokePageProps): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Humor | dbowland.com</title>
      </Helmet>
      <Grid container justifyContent="center" sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item xs>
          <Joke index={parseInt(params.index, 10)} />
          <PrivacyLink />
        </Grid>
      </Grid>
    </>
  )
}

export default JokePage
