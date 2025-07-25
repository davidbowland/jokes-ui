import { AmplifyUser } from '@aws-amplify/ui'
import { Authenticator, defaultDarkModeOverride, ThemeProvider } from '@aws-amplify/ui-react'
import React from 'react'

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'

export interface JokesAuthenticatorProps {
  setLoggedInUser: (user: AmplifyUser | undefined) => void
  setShowLogin: (state: boolean) => void
}

const JokesAuthenticator = ({ setLoggedInUser, setShowLogin }: JokesAuthenticatorProps): React.ReactNode => {
  const theme = {
    name: 'dark-mode-theme',
    overrides: [defaultDarkModeOverride],
  }

  return (
    <main style={{ padding: '50px' }}>
      <section>
        <ThemeProvider colorMode="system" theme={theme}>
          <Paper elevation={6} sx={{ p: { sm: '25px', xs: '15px' } }}>
            <Stack margin="auto" spacing={2}>
              <Authenticator hideSignUp={true}>
                {({ user }) => {
                  setLoggedInUser(user)
                  return <></>
                }}
              </Authenticator>
              <div style={{ textAlign: 'center' }}>
                <Button onClick={() => setShowLogin(false)} startIcon={<CancelOutlinedIcon />} variant="outlined">
                  Cancel
                </Button>
              </div>
            </Stack>
          </Paper>
        </ThemeProvider>
      </section>
    </main>
  )
}

export default JokesAuthenticator
