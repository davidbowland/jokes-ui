import { AmplifyUser } from '@aws-amplify/ui'
import { Authenticator, defaultDarkModeOverride, ThemeProvider } from '@aws-amplify/ui-react'
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

  const components = {
    SignIn: {
      Footer: () => (
        <div className="pb-5 text-center">
          <button
            className="rounded border border-coal px-5 py-2 text-xs text-muted transition-colors duration-200 hover:border-coal/40 hover:text-cream"
            onClick={() => setShowLogin(false)}
            type="button"
          >
            Cancel
          </button>
        </div>
      ),
    },
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-sm">
        <ThemeProvider colorMode="system" theme={theme}>
          <Authenticator components={components} hideSignUp={true}>
            {({ user }) => {
              setLoggedInUser(user)
              return <></>
            }}
          </Authenticator>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default JokesAuthenticator
