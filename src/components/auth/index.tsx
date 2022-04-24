import '@aws-amplify/ui-react/styles.css'
import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import { Auth } from 'aws-amplify'
import { CognitoUserAmplify } from '@aws-amplify/ui'
import Toolbar from '@mui/material/Toolbar'

import JokesAuthenticator from './jokes-authenticator'
import LoggedInBar from './logged-in-bar'
import LoggedOutBar from './logged-out-bar'

export interface AuthenticatedProps {
  children: JSX.Element | JSX.Element[]
}

const Authenticated = ({ children }: AuthenticatedProps): JSX.Element => {
  const [loggedInUser, setLoggedInUser] = useState<CognitoUserAmplify | undefined>(undefined)
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
