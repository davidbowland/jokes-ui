import { Authenticator, ThemeProvider, defaultDarkModeOverride } from '@aws-amplify/ui-react'
import Button from '@mui/material/Button'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { CognitoUserAmplify } from '@aws-amplify/ui'
import React from 'react'
import Stack from '@mui/material/Stack'

export interface JokesAuthenticatorProps {
  setLoggedInUser: (user: CognitoUserAmplify | undefined) => void
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
        </ThemeProvider>
      </section>
    </main>
  )
}

export default JokesAuthenticator
