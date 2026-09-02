import Head from 'next/head'
import React from 'react'

import JokePageLayout from '@components/joke-page-layout'
import Navigation from '@components/navigation'

const IndexPage = (): React.ReactNode => {
  return (
    <>
      <Head>
        <title>Punchline | dbowland.com</title>
        <meta content="Fresh jokes, one punchline at a time." name="description" />
        {/*
          Hardcoded to production, and deliberately not derived from the environment: this same build
          is deployed byte for byte to jokes.bowland.link, where it serves a full crawlable copy of
          this page. The canonical is the only tag that tells a search engine which of the two is the
          original -- og:url below is an unfurl hint and is not read for canonicalization.
        */}
        <link href="https://jokes.dbowland.com/" rel="canonical" />
        <meta content="Punchline" property="og:site_name" />
        <meta content="Punchline" property="og:title" />
        <meta content="Fresh jokes, one punchline at a time." property="og:description" />
        <meta content="website" property="og:type" />
        <meta content="https://jokes.dbowland.com/" property="og:url" />
        <meta content="https://jokes.dbowland.com/og-image.png" property="og:image" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="Punchline" name="twitter:title" />
        <meta content="Fresh jokes, one punchline at a time." name="twitter:description" />
        <meta content="https://jokes.dbowland.com/og-image.png" name="twitter:image" />
      </Head>
      <JokePageLayout>
        <Navigation />
      </JokePageLayout>
    </>
  )
}

export default IndexPage
