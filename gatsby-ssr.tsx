import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { GatsbyBrowser } from 'gatsby'
import React from 'react'

import '@config/amplify'
import Authenticated from '@components/auth'
import Themed from '@components/themed'

const STALE_TIME = 60 * 60 * 1_000 // 1 hr = 60 minutes * 60 seconds * 1,000 ms

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: STALE_TIME,
      staleTime: STALE_TIME,
    }
  },
})

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element }): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Themed>
        <Authenticated>{element}</Authenticated>
      </Themed>
    </QueryClientProvider>
  )
}
