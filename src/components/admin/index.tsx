import '@aws-amplify/ui-react/styles.css'
import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import Divider from '@mui/material/Divider'

import { DisplayedJoke } from '@types'
import SignedIn from './signed-in'

export interface AdminProps {
  joke?: DisplayedJoke
  setJoke: (joke: DisplayedJoke | undefined) => void
}

const Admin = ({ joke, setJoke }: AdminProps): JSX.Element => {
  const [isAdminVisible, setIsAdminVisible] = useState(false)

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setIsAdminVisible(true))
      .catch(() => null)
  }, [])

  if (isAdminVisible) {
    return (
      <>
        <Divider />
        <section className="site-administration">
          <SignedIn joke={joke} setJoke={setJoke} />
        </section>
      </>
    )
  }
  return <></>
}

export default Admin
