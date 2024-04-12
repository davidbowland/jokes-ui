import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import Navigation from '@components/navigation'
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
          <Navigation initialIndex={parseInt(params.index, 10)} />
          <PrivacyLink />
        </Grid>
      </Grid>
    </>
  )
}

export default JokePage
