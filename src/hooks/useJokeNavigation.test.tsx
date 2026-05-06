import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { jokeId, jokeResponse } from '@test/__mocks__'
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
    jest.mocked(jokes).getRandomJokes.mockResolvedValue(jokeResponse)
    console.error = jest.fn()
  })

  describe('initial load', () => {
    it('sets first random joke as current when no initialId is provided', async () => {
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.id).toEqual(jokeResponse[0].id))
    })

    it('keeps remaining jokes in buffer after popping the first', async () => {
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.id).toEqual(jokeResponse[0].id))

      // Second random click should use the buffered second joke
      act(() => {
        result.current.goRandom()
      })
      expect(result.current.id).toEqual(jokeResponse[1].id)
    })

    it('uses initialId directly when provided', async () => {
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      expect(result.current.id).toEqual(jokeId)
      await waitFor(() => expect(jokes.getRandomJokes).toHaveBeenCalledWith([jokeId]))
    })

    it('sets error when random jokes fetch fails', async () => {
      jest.mocked(jokes).getRandomJokes.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeNavigation(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.errorMessage).toContain('Error loading jokes'))
    })
  })

  describe('goRandom', () => {
    const bufferJokes = [
      { data: { contents: 'buffered1' }, id: 'buf111' },
      { data: { contents: 'buffered2' }, id: 'buf222' },
    ]

    it('navigates to a random joke from the buffer', async () => {
      jest.mocked(jokes).getRandomJokes.mockResolvedValue(bufferJokes)
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getRandomJokes).toHaveBeenCalled())

      act(() => {
        result.current.goRandom()
      })

      expect(result.current.id).toEqual('buf111')
    })

    it('pushes current id to history when navigating', async () => {
      jest.mocked(jokes).getRandomJokes.mockResolvedValue(bufferJokes)
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
      let resolveRefill: (value: typeof jokeResponse) => void
      jest.mocked(jokes).getRandomJokes.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRefill = resolve
          }),
      )
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      act(() => {
        result.current.goRandom()
      })

      expect(result.current.errorMessage).toContain('Loading jokes')

      await act(async () => {
        resolveRefill!(jokeResponse)
      })
    })
  })

  describe('goBack', () => {
    const bufferJokes = [
      { data: { contents: 'buffered1' }, id: 'buf111' },
      { data: { contents: 'buffered2' }, id: 'buf222' },
    ]

    it('navigates back to the previous joke', async () => {
      jest.mocked(jokes).getRandomJokes.mockResolvedValue(bufferJokes)
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getRandomJokes).toHaveBeenCalled())

      act(() => {
        result.current.goRandom()
      })
      expect(result.current.id).toEqual('buf111')

      act(() => {
        result.current.goBack()
      })
      expect(result.current.id).toEqual(jokeId)
      expect(result.current.canGoBack).toBe(false)
    })

    it('does nothing when history is empty', async () => {
      const { result } = renderHook(() => useJokeNavigation(jokeId), { wrapper: Wrapper })

      act(() => {
        result.current.goBack()
      })

      expect(result.current.id).toEqual(jokeId)
    })
  })

  describe('resetErrorMessage', () => {
    it('clears the error message', async () => {
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
