import PrivacyPolicy from '@components/privacy-policy'
import { HeadFC } from 'gatsby'
import React from 'react'

import Paper from '@mui/material/Paper'

const PrivacyPage = (): React.ReactNode => {
  return (
    <main>
      <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '900px' }}>
        <PrivacyPolicy />
      </Paper>
    </main>
  )
}

export const Head: HeadFC = () => <title>Privacy Policy | jokes.dbowland.com</title>

export default PrivacyPage
