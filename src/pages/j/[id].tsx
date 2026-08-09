import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import JokePageLayout from '@components/joke-page-layout'
import Navigation from '@components/navigation'

// The only path prerendered at build time. CloudFront rewrites every /j/<id> URL to this
// page, so the placeholder itself resolves to an empty joke -- keep it out of search results.
export const PLACEHOLDER_JOKE_ID = '__placeholder__'

const JokePage = (): React.ReactNode => {
  const router = useRouter()
  const [jokeId, setJokeId] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    const match = window.location.pathname.match(/\/j\/([^/]+)/)
    if (match) {
      setJokeId(match[1])
    }
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>Humor | dbowland.com</title>
        {jokeId === PLACEHOLDER_JOKE_ID ? <meta content="noindex, nofollow" name="robots" /> : null}
      </Head>
      <JokePageLayout>{jokeId === undefined ? null : <Navigation initialIndex={jokeId} />}</JokePageLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  if (process.env.NODE_ENV === 'development') {
    return { fallback: 'blocking', paths: [] }
  }
  return { fallback: false, paths: [{ params: { id: PLACEHOLDER_JOKE_ID } }] }
}

export const getStaticProps: GetStaticProps = () => ({ props: {} })

export default JokePage
