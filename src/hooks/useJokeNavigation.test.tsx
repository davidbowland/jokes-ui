import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { index } from '@test/__mocks__'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { useJokeNavigation } from './useJokeNavigation'
import * as jokes from '@services/jokes'

jest.mock('@services/jokes')

const bufferJokes = [
  { data: { contents: 'buffered1' }, id: 'buf1' },
  { data: { contents: 'buffered2' }, id: 'buf2' },
  { data: { contents: 'buffered3' }, id: 'buf3' },
  { data: { contents: 'buffered4' }, id: 'buf4' },
  { data: { contents: 'buffered5' }, id: 'buf5' },
]

describe('useJokeNavigation', () => {
  let queryClient: QueryClient

  const Wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  function setup() {
    queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: 0, retry: false, staleTime: 0 } },
    })
    jest.mocked(jokes).getRandomJokes.mockResolvedValue(bufferJokes)
    console.error = jest.fn()
  }

  const initHook = async (initialIndex?: string) => {
    const hook = renderHook(() => useJokeNavigation(initialIndex), { wrapper: Wrapper })
    await waitFor(() => expect(jest.mocked(jokes).getRandomJokes).toHaveBeenCalled())
    await act(async () => {})
    return hook
  }

  describe('initial load', () => {
    it('sets first random joke as current when no initialIndex is provided', async () => {
      setup()
      const { result } = await initHook()

      expect(result.current.index).toEqual('buf1')
    })

    it('uses initialIndex directly when provided', async () => {
      setup()
      const { result } = await initHook(index)

      expect(result.current.index).toEqual(index)
      expect(jest.mocked(jokes).getRandomJokes).toHaveBeenCalledWith([index])
    })

    it('sets error when random jokes fetch fails', async () => {
      setup()
      jest.mocked(jokes).getRandomJokes.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toContain('Error loading jokes'))
    })
  })

  describe('goRandom', () => {
    it('navigates to a random joke from the buffer', async () => {
      setup()
      const { result } = await initHook(index)

      await act(async () => {
        result.current.goRandom()
      })

      expect(result.current.index).toEqual('buf1')
    })

    it('enables back after navigating', async () => {
      setup()
      const { result } = await initHook(index)

      expect(result.current.canGoBack).toBe(false)
      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.canGoBack).toBe(true)
    })

    it('truncates forward history when navigating to random (browser-style)', async () => {
      setup()
      const { result } = await initHook(index)

      // Navigate forward twice: index → 111 → 222
      await act(async () => {
        result.current.goRandom()
      })
      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.index).toEqual('buf2')

      // Go back to 111
      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.index).toEqual('buf1')
      expect(result.current.canGoForward).toBe(true)

      // Navigate to random — forward history (222) should be gone
      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.canGoForward).toBe(false)
    })

    it('shows error message when buffer is empty', async () => {
      setup()
      jest.mocked(jokes).getRandomJokes.mockResolvedValueOnce([])
      const { result } = await initHook(index)

      await act(async () => {
        result.current.goRandom()
      })

      expect(result.current.errorMessage).toContain('Loading jokes')
    })
  })

  describe('goBack', () => {
    it('navigates back to the previous joke', async () => {
      setup()
      const { result } = await initHook(index)

      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.index).toEqual('buf1')

      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.index).toEqual(index)
      expect(result.current.canGoBack).toBe(false)
    })

    it('does nothing when at the beginning', async () => {
      setup()
      const { result } = await initHook(index)

      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.index).toEqual(index)
    })
  })

  describe('goForward', () => {
    it('navigates forward after going back', async () => {
      setup()
      const { result } = await initHook(index)

      await act(async () => {
        result.current.goRandom()
      })
      expect(result.current.index).toEqual('buf1')

      await act(async () => {
        result.current.goBack()
      })
      expect(result.current.index).toEqual(index)

      await act(async () => {
        result.current.goForward()
      })
      expect(result.current.index).toEqual('buf1')
    })

    it('does nothing when at the end of timeline', async () => {
      setup()
      const { result } = await initHook(index)

      expect(result.current.canGoForward).toBe(false)
      await act(async () => {
        result.current.goForward()
      })
      expect(result.current.index).toEqual(index)
    })
  })

  describe('resetErrorMessage', () => {
    it('clears the error message', async () => {
      setup()
      jest.mocked(jokes).getRandomJokes.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toBeDefined())

      act(() => {
        result.current.resetErrorMessage()
      })

      expect(result.current.errorMessage).toBeUndefined()
    })
  })
})
