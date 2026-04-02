import Head from 'next/head'
import React from 'react'

import JokePageLayout from '@components/joke-page-layout'
import Navigation from '@components/navigation'

const IndexPage = (): React.ReactNode => {
  return (
    <>
      <Head>
        <title>Humor | dbowland.com</title>
      </Head>
      <JokePageLayout>
        <Navigation />
      </JokePageLayout>
    </>
  )
}

export default IndexPage
