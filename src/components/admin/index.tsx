import '@aws-amplify/ui-react/styles.css'
import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import Divider from '@mui/material/Divider'

import { JokeType } from '@types'
import SignedIn from './signed-in'

export interface AdminProps {
  index: number
  joke: JokeType
  setJoke: (joke: JokeType, targetIndex?: number) => void
}

const Admin = ({ index, joke, setJoke }: AdminProps): JSX.Element => {
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
          <SignedIn index={index} joke={joke} setJoke={setJoke} />
        </section>
      </>
    )
  }
  return <></>
}

export default Admin
