import { AmplifyUser } from '@aws-amplify/ui'
import '@aws-amplify/ui-react/styles.css'
import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'

import { NavBar } from './elements'
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
      <NavBar>
        {loggedInUser ? (
          <LoggedInBar setLoggedInUser={setLoggedInUser} />
        ) : (
          <LoggedOutBar setShowLogin={setShowLogin} />
        )}
      </NavBar>
      {showLogin && !loggedInUser ? (
        <JokesAuthenticator setLoggedInUser={setLoggedInUser} setShowLogin={setShowLogin} />
      ) : (
        children
      )}
    </>
  )
}

export default Authenticated
