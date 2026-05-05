import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { jokeId, jokeType } from '@test/__mocks__'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { useJokeMutations } from './useJokeMutations'
import * as jokes from '@services/jokes'

jest.mock('@services/jokes')

describe('useJokeMutations', () => {
  let queryClient: QueryClient

  const Wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: 0, retry: false, staleTime: 0 } },
    })
    // Pre-populate the cache with the current joke so updateJoke can diff against it
    queryClient.setQueryData(['joke', jokeId], jokeType)

    jest.mocked(jokes).postJoke.mockResolvedValue({ contents: 'LOL', index: 'new123' })
    jest.mocked(jokes).patchJoke.mockResolvedValue({ contents: 'updated' })
    console.error = jest.fn()
  })

  describe('addJoke', () => {
    it('creates a joke and returns the new id', async () => {
      const { result } = renderHook(() => useJokeMutations(jokeId), { wrapper: Wrapper })

      let newId: string | undefined
      await act(async () => {
        newId = await result.current.addJoke({ contents: 'new joke' })
      })

      expect(newId).toEqual('new123')
      expect(jokes.postJoke).toHaveBeenCalledWith({ contents: 'new joke' })
    })

    it('sets error message when create fails', async () => {
      jest.mocked(jokes).postJoke.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeMutations(jokeId), { wrapper: Wrapper })

      await act(async () => {
        await expect(result.current.addJoke({ contents: 'new joke' })).rejects.toThrow('fail')
      })

      await waitFor(() => {
        expect(result.current.errorMessage).toContain('Error creating joke')
      })
    })
  })

  describe('updateJoke', () => {
    it('patches the joke using json diff against cached version', async () => {
      const { result } = renderHook(() => useJokeMutations(jokeId), { wrapper: Wrapper })

      await act(async () => {
        await result.current.updateJoke({ contents: 'updated contents' })
      })

      expect(jokes.patchJoke).toHaveBeenCalledWith(
        jokeId,
        expect.arrayContaining([expect.objectContaining({ op: 'replace', path: '/contents' })]),
      )
    })

    it('reads latest cache value to avoid stale diffs', async () => {
      const { result } = renderHook(() => useJokeMutations(jokeId), { wrapper: Wrapper })

      // Simulate another process updating the cache (e.g., a refetch)
      queryClient.setQueryData(['joke', jokeId], { contents: 'server-updated' })

      await act(async () => {
        await result.current.updateJoke({ contents: 'my edit' })
      })

      // Should diff against 'server-updated', not the original jokeType
      expect(jokes.patchJoke).toHaveBeenCalledWith(
        jokeId,
        expect.arrayContaining([expect.objectContaining({ op: 'replace', path: '/contents', value: 'my edit' })]),
      )
    })

    it('does nothing when currentId is undefined', async () => {
      const { result } = renderHook(() => useJokeMutations(undefined), { wrapper: Wrapper })

      await act(async () => {
        await result.current.updateJoke({ contents: 'test' })
      })

      expect(jokes.patchJoke).not.toHaveBeenCalled()
    })

    it('does nothing when joke is not in cache', async () => {
      // Clear the cache so there's nothing to diff against
      queryClient.removeQueries({ queryKey: ['joke', jokeId] })
      const { result } = renderHook(() => useJokeMutations(jokeId), { wrapper: Wrapper })

      await act(async () => {
        await result.current.updateJoke({ contents: 'test' })
      })

      expect(jokes.patchJoke).not.toHaveBeenCalled()
    })

    it('sets error message when patch fails', async () => {
      jest.mocked(jokes).patchJoke.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeMutations(jokeId), { wrapper: Wrapper })

      await act(async () => {
        await expect(result.current.updateJoke({ contents: 'test' })).rejects.toThrow('fail')
      })

      await waitFor(() => {
        expect(result.current.errorMessage).toContain('Error updating joke')
      })
    })
  })

  describe('resetErrorMessage', () => {
    it('clears the error message', async () => {
      jest.mocked(jokes).postJoke.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeMutations(jokeId), { wrapper: Wrapper })

      await act(async () => {
        await expect(result.current.addJoke({ contents: 'x' })).rejects.toThrow()
      })

      await waitFor(() => expect(result.current.errorMessage).toBeDefined())

      act(() => {
        result.current.resetErrorMessage()
      })

      expect(result.current.errorMessage).toBeUndefined()
    })
  })
})
