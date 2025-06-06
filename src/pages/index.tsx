import Navigation from '@components/navigation'
import PrivacyLink from '@components/privacy-link'
import React from 'react'

import Grid from '@mui/material/Grid'

const IndexPage = (): React.ReactNode => {
  return (
    <Grid container justifyContent="center" sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
      <Grid item xs>
        <Navigation />
        <PrivacyLink />
      </Grid>
    </Grid>
  )
}

export const Head = () => <title>Humor | dbowland.com</title>

export default IndexPage
