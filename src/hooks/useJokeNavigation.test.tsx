import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initialResponse, jokeId, jokeResponse } from '@test/__mocks__'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { useJokeNavigation } from './useJokeNavigation'
import * as jokes from '@services/jokes'

jest.mock('@services/jokes')

const Wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { gcTime: 0, retry: false, staleTime: 0 } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useJokeNavigation', () => {
  beforeAll(() => {
    jest.mocked(jokes).getInitialData.mockResolvedValue(initialResponse)
    jest.mocked(jokes).getJokeCount.mockResolvedValue({ count: 128 })
    jest.mocked(jokes).getRandomJokes.mockResolvedValue(jokeResponse)
    console.error = jest.fn()
  })

  describe('initial load', () => {
    it('fetches initial data when no initialId is provided', async () => {
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.id).toEqual(initialResponse.joke.id))
      expect(result.current.count).toEqual(initialResponse.count)
    })

    it('fetches only count when initialId is provided', async () => {
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.count).toEqual(128))
      expect(result.current.id).toEqual(jokeId)
    })

    it('sets error when initial data fetch fails', async () => {
      jest.mocked(jokes).getInitialData.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toContain('Error fetching initial data'))
    })

    it('sets error when joke count fetch fails', async () => {
      jest.mocked(jokes).getJokeCount.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toContain('Error fetching joke count'))
    })
  })

  describe('goRandom', () => {
    it('navigates to a random joke from the buffer', async () => {
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      // Wait for buffer to fill
      await waitFor(() => expect(jokes.getRandomJokes).toHaveBeenCalled())

      act(() => {
        result.current.goRandom()
      })

      expect(result.current.id).toEqual(jokeResponse[0].id)
    })

    it('pushes current id to history when navigating', async () => {
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getRandomJokes).toHaveBeenCalled())

      act(() => {
        result.current.goRandom()
      })

      expect(result.current.canGoBack).toBe(true)
    })

    it('shows error message when buffer is empty', async () => {
      jest.mocked(jokes).getRandomJokes.mockResolvedValueOnce([]).mockResolvedValueOnce([])
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getRandomJokes).toHaveBeenCalled())

      act(() => {
        result.current.goRandom()
      })

      expect(result.current.errorMessage).toContain('Loading jokes')
    })

    it('does not double-refill when already refilling', async () => {
      // Make refill slow so we can trigger it twice
      let resolveRefill: (value: typeof jokeResponse) => void
      jest.mocked(jokes).getRandomJokes.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRefill = resolve
          }),
      )
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      // First refill is in progress (triggered by useEffect)
      // Try goRandom while buffer is empty — should show error, not crash
      act(() => {
        result.current.goRandom()
      })

      expect(result.current.errorMessage).toContain('Loading jokes')

      // Resolve the pending refill
      await act(async () => {
        resolveRefill!(jokeResponse)
      })
    })
  })

  describe('goBack', () => {
    it('navigates back to the previous joke', async () => {
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getRandomJokes).toHaveBeenCalled())

      // Navigate forward
      act(() => {
        result.current.goRandom()
      })
      expect(result.current.id).toEqual(jokeResponse[0].id)

      // Navigate back
      act(() => {
        result.current.goBack()
      })
      expect(result.current.id).toEqual(jokeId)
      expect(result.current.canGoBack).toBe(false)
    })

    it('does nothing when history is empty', async () => {
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJokeCount).toHaveBeenCalled())

      act(() => {
        result.current.goBack()
      })

      expect(result.current.id).toEqual(jokeId)
    })
  })

  describe('resetErrorMessage', () => {
    it('clears the error message', async () => {
      jest.mocked(jokes).getJokeCount.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toBeDefined())

      act(() => {
        result.current.resetErrorMessage()
      })

      expect(result.current.errorMessage).toBeUndefined()
    })
  })
})
