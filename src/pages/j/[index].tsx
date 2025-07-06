import { HeadFC } from 'gatsby'
import React from 'react'

import Grid from '@mui/material/Grid'

import Navigation from '@components/navigation'
import PrivacyLink from '@components/privacy-link'

export interface JokePageProps {
  params: {
    index: string
  }
}

const JokePage = ({ params }: JokePageProps): React.ReactNode => {
  return (
    <Grid container justifyContent="center" sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
      <Grid item xs>
        <Navigation initialIndex={parseInt(params.index, 10)} />
        <PrivacyLink />
      </Grid>
    </Grid>
  )
}

export const Head: HeadFC = () => <title>Humor | dbowland.com</title>

export default JokePage
