import '@aws-amplify/ui-react/styles.css'
import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'

import SignedIn from './signed-in'
import { JokeType } from '@types'

export interface AdminProps {
  addJoke: (newJoke: JokeType) => Promise<string>
  index: string
  joke: JokeType
  updateJoke: (joke: JokeType) => Promise<void>
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
      <div className="mt-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-coal" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/60">Administration</span>
          <div className="h-px flex-1 bg-coal" />
        </div>
        <section className="site-administration">
          <SignedIn addJoke={addJoke} index={index} joke={joke} updateJoke={updateJoke} />
        </section>
      </div>
    )
  }
  return <></>
}

export default Admin
