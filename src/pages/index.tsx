import { Helmet } from 'react-helmet'
import React from 'react'

import Joke from '@components/joke'

const Humor = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Humor | dbowland.com</title>
      </Helmet>
      <main className="main-content">
        <Joke initialize={typeof window !== 'undefined'} />
      </main>
    </>
  )
}

export default Humor
