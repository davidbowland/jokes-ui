import { Authenticator, ThemeProvider, defaultDarkModeOverride } from '@aws-amplify/ui-react'
import { AmplifyUser } from '@aws-amplify/ui'
import Button from '@mui/material/Button'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import Paper from '@mui/material/Paper'
import React from 'react'
import Stack from '@mui/material/Stack'

export interface JokesAuthenticatorProps {
  setLoggedInUser: (user: AmplifyUser | undefined) => void
  setShowLogin: (state: boolean) => void
}

const JokesAuthenticator = ({ setLoggedInUser, setShowLogin }: JokesAuthenticatorProps): JSX.Element => {
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
