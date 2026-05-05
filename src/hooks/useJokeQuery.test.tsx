import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { jokeId, jokeType } from '@test/__mocks__'
import { renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { useJokeQuery } from './useJokeQuery'
import * as jokes from '@services/jokes'

jest.mock('@services/jokes')

const Wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { gcTime: 0, retry: false, staleTime: 0 } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useJokeQuery', () => {
  beforeAll(() => {
    jest.mocked(jokes).getJoke.mockResolvedValue(jokeType)
    console.error = jest.fn()
  })

  it('fetches a joke by id', async () => {
    const { result } = renderHook(() => useJokeQuery(jokeId), { wrapper: Wrapper })

    await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(jokeId))
    expect(result.current.joke).toEqual(jokeType)
    expect(result.current.error).toBeNull()
  })

  it('does not fetch when id is undefined', () => {
    const { result } = renderHook(() => useJokeQuery(undefined), { wrapper: Wrapper })

    expect(jokes.getJoke).not.toHaveBeenCalled()
    expect(result.current.joke).toBeUndefined()
  })

  it('returns an error when the fetch fails', async () => {
    jest.mocked(jokes).getJoke.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useJokeQuery(jokeId), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect(result.current.joke).toBeUndefined()
  })
})
