import { AmplifyUser } from '@aws-amplify/ui'
import { Authenticator, defaultDarkModeOverride, ThemeProvider } from '@aws-amplify/ui-react'
import { Button } from '@heroui/react'
import { XCircle } from 'lucide-react'
import React from 'react'

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
          <div className="mx-auto max-w-[900px] p-4 shadow-lg sm:p-6">
            <div className="mx-auto flex flex-col gap-4">
              <Authenticator hideSignUp={true}>
                {({ user }) => {
                  setLoggedInUser(user)
                  return <></>
                }}
              </Authenticator>
              <div className="text-center">
                <Button onPress={() => setShowLogin(false)} variant="outline">
                  <XCircle size={18} />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </section>
    </main>
  )
}

export default JokesAuthenticator
