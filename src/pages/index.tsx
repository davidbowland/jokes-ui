import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import Joke from '@components/joke'
import PrivacyLink from '@components/privacy-link'

const IndexPage = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Humor | dbowland.com</title>
      </Helmet>
      <Grid container justifyContent="center" sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item xs>
          <Joke />
          <PrivacyLink />
        </Grid>
      </Grid>
    </>
  )
}

export default IndexPage
