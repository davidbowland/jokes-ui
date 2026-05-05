import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import JokePageLayout from '@components/joke-page-layout'
import Navigation from '@components/navigation'

const JokePage = (): React.ReactNode => {
  const router = useRouter()
  const [id, setId] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    const match = window.location.pathname.match(/\/j\/([^/]+)/)
    if (match) {
      setId(match[1])
    }
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>Humor | dbowland.com</title>
      </Head>
      <JokePageLayout>{id === undefined ? null : <Navigation initialId={id} />}</JokePageLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  if (process.env.NODE_ENV === 'development') {
    return { fallback: 'blocking', paths: [] }
  }
  return { fallback: false, paths: [{ params: { id: '__placeholder__' } }] }
}

export const getStaticProps: GetStaticProps = () => ({ props: {} })

export default JokePage
