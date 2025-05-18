import Typography from '@mui/material/Typography'
import { Link } from 'gatsby'
import React from 'react'

const PrivacyLink = (): JSX.Element => {
  return (
    <Typography component="div" sx={{ textAlign: 'center' }} variant="caption">
      <Link to="/privacy-policy">Privacy policy</Link>
    </Typography>
  )
}

export default PrivacyLink
