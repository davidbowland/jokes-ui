import { AmplifyUser } from '@aws-amplify/ui'
import '@aws-amplify/ui-react/styles.css'
import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

import JokesAuthenticator from './jokes-authenticator'
import LoggedInBar from './logged-in-bar'
import LoggedOutBar from './logged-out-bar'

export interface AuthenticatedProps {
  children: React.ReactNode | React.ReactNode[]
}

const Authenticated = ({ children }: AuthenticatedProps): React.ReactNode => {
  const [loggedInUser, setLoggedInUser] = useState<AmplifyUser | undefined>()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    setShowLogin(false)
  }, [loggedInUser])

  // Set user if already logged in
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(setLoggedInUser)
      .catch(() => null)
  }, [])

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {loggedInUser ? (
            <LoggedInBar setLoggedInUser={setLoggedInUser} />
          ) : (
            <LoggedOutBar setShowLogin={setShowLogin} />
          )}
        </Toolbar>
      </AppBar>
      {showLogin && !loggedInUser ? (
        <JokesAuthenticator setLoggedInUser={setLoggedInUser} setShowLogin={setShowLogin} />
      ) : (
        children
      )}
    </>
  )
}

export default Authenticated
