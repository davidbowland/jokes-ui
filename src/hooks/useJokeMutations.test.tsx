import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { index, jokeType } from '@test/__mocks__'
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

  function setup() {
    queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: 0, retry: false, staleTime: 0 } },
    })
    queryClient.setQueryData(['joke', index], jokeType)

    jest.mocked(jokes).postJoke.mockResolvedValue({ contents: 'LOL', index: 'new62' })
    jest.mocked(jokes).patchJoke.mockResolvedValue({ contents: 'updated' })
  }

  beforeAll(() => {
    console.error = jest.fn()
  })

  describe('addJoke', () => {
    it('creates a joke and returns the new index', async () => {
      setup()
      const { result } = renderHook(() => useJokeMutations(index), { wrapper: Wrapper })

      let newIndex: string | undefined
      await act(async () => {
        newIndex = await result.current.addJoke({ contents: 'new joke' })
      })

      expect(newIndex).toEqual('new62')
      expect(jokes.postJoke).toHaveBeenCalledWith({ contents: 'new joke' })
    })

    it('sets error message when create fails', async () => {
      setup()
      jest.mocked(jokes).postJoke.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeMutations(index), { wrapper: Wrapper })

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
      setup()
      const { result } = renderHook(() => useJokeMutations(index), { wrapper: Wrapper })

      await act(async () => {
        await result.current.updateJoke({ contents: 'updated contents' })
      })

      expect(jokes.patchJoke).toHaveBeenCalledWith(
        index,
        expect.arrayContaining([expect.objectContaining({ op: 'replace', path: '/contents' })]),
      )
    })

    it('reads latest cache value to avoid stale diffs', async () => {
      setup()
      const { result } = renderHook(() => useJokeMutations(index), { wrapper: Wrapper })

      queryClient.setQueryData(['joke', index], { contents: 'server-updated' })

      await act(async () => {
        await result.current.updateJoke({ contents: 'my edit' })
      })

      expect(jokes.patchJoke).toHaveBeenCalledWith(
        index,
        expect.arrayContaining([expect.objectContaining({ op: 'replace', path: '/contents', value: 'my edit' })]),
      )
    })

    it('does nothing when currentIndex is undefined', async () => {
      setup()
      const { result } = renderHook(() => useJokeMutations(undefined), { wrapper: Wrapper })

      await act(async () => {
        await result.current.updateJoke({ contents: 'test' })
      })

      expect(jokes.patchJoke).not.toHaveBeenCalled()
    })

    it('does nothing when joke is not in cache', async () => {
      setup()
      queryClient.removeQueries({ queryKey: ['joke', index] })
      const { result } = renderHook(() => useJokeMutations(index), { wrapper: Wrapper })

      await act(async () => {
        await result.current.updateJoke({ contents: 'test' })
      })

      expect(jokes.patchJoke).not.toHaveBeenCalled()
    })

    it('sets error message when patch fails', async () => {
      setup()
      jest.mocked(jokes).patchJoke.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeMutations(index), { wrapper: Wrapper })

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
      setup()
      jest.mocked(jokes).postJoke.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useJokeMutations(index), { wrapper: Wrapper })

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
