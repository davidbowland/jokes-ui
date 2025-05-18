import PrivacyPolicy from '@components/privacy-policy'
import Paper from '@mui/material/Paper'
import React from 'react'
import { Helmet } from 'react-helmet'

const PrivacyPage = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy -- jokes.dbowland.com</title>
      </Helmet>
      <main>
        <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '900px' }}>
          <PrivacyPolicy />
        </Paper>
      </main>
    </>
  )
}

export default PrivacyPage
