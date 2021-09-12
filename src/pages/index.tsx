import React from 'react'
import { Helmet } from 'react-helmet'

import Joke from '@components/joke'

import '@fontsource/rokkitt'
import 'normalize.css'

const Humor = (): JSX.Element => {
  return (
    <main>
      <Helmet>
        <title>Humor | dbowland.com</title>
      </Helmet>
      <Joke initialize={typeof window !== 'undefined'} />
    </main>
  )
}

export default Humor
