import '@fontsource/dm-sans'
import '@fontsource/playfair-display'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'

import '@assets/css/index.css'
import Authenticated from '@components/auth'
import Disclaimer from '@components/disclaimer'
import '@config/amplify'

const STALE_TIME = 60 * 60 * 1_000

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: STALE_TIME,
      staleTime: STALE_TIME,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => document.documentElement.classList.toggle('dark', e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Authenticated>
        <Component {...pageProps} />
      </Authenticated>
      <Disclaimer />
    </QueryClientProvider>
  )
}
