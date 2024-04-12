import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import Navigation from '@components/navigation'
import PrivacyLink from '@components/privacy-link'

const IndexPage = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Humor | dbowland.com</title>
      </Helmet>
      <Grid container justifyContent="center" sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item xs>
          <Navigation />
          <PrivacyLink />
        </Grid>
      </Grid>
    </>
  )
}

export default IndexPage
