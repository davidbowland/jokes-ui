import { Helmet } from 'react-helmet'
import Paper from '@mui/material/Paper'
import React from 'react'

import '@config/amplify'
import PrivacyPolicy from '@components/privacy-policy'

const PrivacyPage = (): JSX.Element => {
  return (
    <Paper elevation={1}>
      <Helmet>
        <title>Privacy Policy -- jokes.dbowland.com</title>
      </Helmet>
      <main>
        <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '900px' }}>
          <PrivacyPolicy />
        </Paper>
      </main>
    </Paper>
  )
}

export default PrivacyPage
