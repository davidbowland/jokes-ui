import { AuthUser, getCurrentUser } from 'aws-amplify/auth'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

import { NavBar } from './elements'
import LoggedInBar from './logged-in-bar'
import LoggedOutBar from './logged-out-bar'

// Loaded on demand so the Amplify UI stylesheet stays off the critical render path
const JokesAuthenticator = dynamic(() => import('./jokes-authenticator'), { ssr: false })

export interface AuthenticatedProps {
  children: React.ReactNode | React.ReactNode[]
}

const Authenticated = ({ children }: AuthenticatedProps): React.ReactNode => {
  const [loggedInUser, setLoggedInUser] = useState<AuthUser | undefined>()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    setShowLogin(false)
  }, [loggedInUser])

  // Set user if already logged in
  useEffect(() => {
    getCurrentUser()
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
