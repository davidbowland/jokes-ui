import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { jokeId } from '@test/__mocks__'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { useJokeNavigation } from './useJokeNavigation'
import * as jokes from '@services/jokes'

jest.mock('@services/jokes')

const bufferJokes = [
  { data: { contents: 'buffered1' }, id: 'buf111' },
  { data: { contents: 'buffered2' }, id: 'buf222' },
  { data: { contents: 'buffered3' }, id: 'buf333' },
  { data: { contents: 'buffered4' }, id: 'buf444' },
  { data: { contents: 'buffered5' }, id: 'buf555' },
]

describe('useJokeNavigation', () => {
  let queryClient: QueryClient

  const Wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: 0, retry: false, staleTime: 0 } },
    })
    jest.mocked(jokes).getRandomJokes.mockResolvedValue(bufferJokes)
    console.error = jest.fn()
  })

  const initHook = async (initialId?: string) => {
    const hook = renderHook(() => useJokeNavigation(initialId), { wrapper: Wrapper })
    await waitFor(() => expect(jest.mocked(jokes).getRandomJokes).toHaveBeenCalled())
    await act(async () => {})
    return hook
  }

  describe('initial load', () => {
    it('sets first random joke as current when no initialId is provided', async () => {
      const { result } = await initHook()

      expect(result.current.id).toEqual('buf111')
    })

    it('uses initialId directly when provided', async () => {
      const { result } = await initHook(jokeId)

      expect(result.current.id).toEqual(jokeId)
      expect(jest.mocked(jokes).getRandomJokes).toHaveBeenCalledWith([jokeId])
    })

    it('sets error when random jokes fetch fails', async () => {
      jest.mocked(jokes).getRandomJokes.mockRejectedValue(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toContain('Error loading jokes'))
    })
  })

  describe('goRandom', () => {
    it('navigates to a random joke from the buffer', async () => {
      const { result } = await initHook(jokeId)

      await act(async () => {
        result.current.goRandom()
      })

      expect(result.current.id).toEqual('buf111')
    })

    it('enables back after navigating', async () => {
      const { result } = await initHook(jokeId)

      expect(result.current.canGoBack).toBe(false)
      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.canGoBack).toBe(true)
    })

    it('truncates forward history when navigating to random (browser-style)', async () => {
      const { result } = await initHook(jokeId)

      // Navigate forward twice: jokeId → buf111 → buf222
      await act(async () => {
        result.current.goRandom()
      })
      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.id).toEqual('buf222')

      // Go back to buf111
      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.id).toEqual('buf111')
      expect(result.current.canGoForward).toBe(true)

      // Navigate to random — forward history (buf222) should be gone
      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.canGoForward).toBe(false)
    })

    it('shows error message when buffer is empty', async () => {
      jest.mocked(jokes).getRandomJokes.mockResolvedValue([])
      const { result } = await initHook(jokeId)

      await act(async () => {
        result.current.goRandom()
      })

      expect(result.current.errorMessage).toContain('Loading jokes')
    })
  })

  describe('goBack', () => {
    it('navigates back to the previous joke', async () => {
      const { result } = await initHook(jokeId)

      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.id).toEqual('buf111')

      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.id).toEqual(jokeId)
      expect(result.current.canGoBack).toBe(false)
    })

    it('does nothing when at the beginning', async () => {
      const { result } = await initHook(jokeId)

      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.id).toEqual(jokeId)
    })
  })

  describe('goForward', () => {
    it('navigates forward after going back', async () => {
      const { result } = await initHook(jokeId)

      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.id).toEqual('buf111')

      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.id).toEqual(jokeId)

      await act(async () => {
        result.current.goForward()
      })
      expect(result.current.id).toEqual('buf111')
    })

    it('does nothing when at the end of timeline', async () => {
      const { result } = await initHook(jokeId)

      expect(result.current.canGoForward).toBe(false)
      await act(async () => {
        result.current.goForward()
      })
      expect(result.current.id).toEqual(jokeId)
    })
  })

  describe('resetErrorMessage', () => {
    it('clears the error message', async () => {
      jest.mocked(jokes).getRandomJokes.mockRejectedValue(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toBeDefined())

      act(() => {
        result.current.resetErrorMessage()
      })

      expect(result.current.errorMessage).toBeUndefined()
    })
  })
})
