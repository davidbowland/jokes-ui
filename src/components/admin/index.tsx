import '@aws-amplify/ui-react/styles.css'
import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'

import Divider from '@mui/material/Divider'

import SignedIn from './signed-in'
import { JokeType } from '@types'

export interface AdminProps {
  addJoke: (newJoke: JokeType) => Promise<number>
  index: number
  joke: JokeType
  updateJoke: (joke: JokeType, indexOverride?: number) => Promise<void>
}

const Admin = ({ addJoke, index, joke, updateJoke }: AdminProps): React.ReactNode => {
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
          <SignedIn addJoke={addJoke} index={index} joke={joke} updateJoke={updateJoke} />
        </section>
      </>
    )
  }
  return <></>
}

export default Admin
