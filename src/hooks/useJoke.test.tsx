import * as jokes from '@services/jokes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { displayedJoke, initialResponse, jokeCount, jokeType } from '@test/__mocks__'
import { renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { useJoke } from './useJoke'

jest.mock('@services/jokes')

const baseUrl = process.env.GATSBY_JOKE_API_BASE_URL
const Wrapper = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
        staleTime: 0,
      },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useJoke', () => {
  beforeAll(() => {
    jest.mocked(jokes).getInitialData.mockResolvedValue(initialResponse)
    jest.mocked(jokes).getJoke.mockResolvedValue(jokeType)
    jest.mocked(jokes).getJokeCount.mockResolvedValue(jokeCount)
    jest.mocked(jokes).postJoke.mockResolvedValue({ index: 62 })

    const mockMath = Object.create(global.Math)
    mockMath.random = jest.fn().mockReturnValue(0)
    global.Math = mockMath

    console.error = jest.fn()
  })

  describe('addJoke', () => {
    const newJoke = { contents: 'new-joke' }

    it('adds a joke to the list', async () => {
      const { result } = renderHook(() => useJoke(), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getInitialData).toHaveBeenCalled())
      const newIndex = await result.current.addJoke(newJoke)
      jest.mocked(jokes).getJoke.mockResolvedValueOnce(newJoke).mockResolvedValueOnce(newJoke)
      expect(newIndex).toEqual(62)
      await waitFor(() => expect(result.current.joke).toEqual(newJoke))
      await waitFor(() => expect(result.current.index).toEqual(62))
    })

    it('returns an error message when reject posting joke', async () => {
      jest.mocked(jokes).postJoke.mockRejectedValueOnce(new Error('Failed to post joke'))
      const { result } = renderHook(() => useJoke(), { wrapper: Wrapper })

      await expect(result.current.addJoke(newJoke)).rejects.toThrow('Failed to post joke')
      await waitFor(() =>
        expect(result.current.errorMessage).toEqual('Error creating joke. Please reload to try again.'),
      )
    })
  })

  describe('errorMessage', () => {
    it('returns an error message when reject fetching joke', async () => {
      jest.mocked(jokes).getJoke.mockRejectedValueOnce(new Error('Failed to fetch joke'))
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalled())
      await waitFor(() =>
        expect(result.current.errorMessage).toEqual('Error fetching joke. Please reload to try again.'),
      )
    })

    it('returns an error message when reject fetching joke count', async () => {
      jest.mocked(jokes).getJokeCount.mockRejectedValueOnce(new Error('Failed to fetch joke count'))
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJokeCount).toHaveBeenCalled())
      await waitFor(() =>
        expect(result.current.errorMessage).toEqual('Error fetching joke count. Please reload to try again.'),
      )
    })

    it('returns an error message when reject fetching initial data', async () => {
      jest.mocked(jokes).getInitialData.mockRejectedValueOnce(new Error('Failed to fetch initial data'))
      const { result } = renderHook(() => useJoke(), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getInitialData).toHaveBeenCalled())
      await waitFor(() =>
        expect(result.current.errorMessage).toEqual('Error fetching initial data. Please reload to try again.'),
      )
    })
  })

  describe('getTtsUrl', () => {
    it('returns the tts URL when audio is provided', async () => {
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalled())
      const ttsUrl = result.current.getTtsUrl()
      expect(ttsUrl).toEqual('data:text/plain;base64,yalp')
    })

    it('returns the tts URL when no audio is provided', async () => {
      jest.mocked(jokes).getJoke.mockResolvedValueOnce({ ...jokeType, audio: undefined })
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalled())
      const ttsUrl = result.current.getTtsUrl()
      expect(ttsUrl).toEqual(`${baseUrl}/jokes/${displayedJoke.index}/tts`)
    })
  })

  describe('hasNextJoke', () => {
    it('returns true when there is a next joke', async () => {
      const { result } = renderHook(() => useJoke(2, 3), { wrapper: Wrapper })

      expect(result.current.hasNextJoke).toBeTruthy()
    })

    it('returns false when there is no next joke', async () => {
      const { result } = renderHook(() => useJoke(2, 2), { wrapper: Wrapper })

      expect(result.current.hasNextJoke).toBeFalsy()
    })
  })

  describe('hasPreviousJoke', () => {
    it('returns true when there is a previous joke', async () => {
      const { result } = renderHook(() => useJoke(2, 3), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJokeCount).toHaveBeenCalled())
      expect(result.current.hasPreviousJoke).toBeTruthy()
    })

    it('returns false when there is no previous joke', async () => {
      const { result } = renderHook(() => useJoke(1, 1), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJokeCount).toHaveBeenCalled())
      expect(result.current.hasPreviousJoke).toBeFalsy()
    })
  })

  describe('index', () => {
    it('returns the displayed joke index', async () => {
      const { result } = renderHook(() => useJoke(), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getInitialData).toHaveBeenCalled())
      expect(result.current.index).toEqual(displayedJoke.index)
    })

    it('returns the passed index', async () => {
      const newIndex = 7
      const { result } = renderHook(() => useJoke(newIndex), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJokeCount).toHaveBeenCalled())
      expect(result.current.index).toEqual(newIndex)
    })
  })

  describe('joke', () => {
    it('returns the joke from initial data', async () => {
      const { result } = renderHook(() => useJoke(), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(42))
      expect(result.current.joke).toEqual(jokeType)
    })

    it('returns the joke index passed', async () => {
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(displayedJoke.index))
      expect(result.current.joke).toEqual(jokeType)
    })
  })

  describe('nextJoke', () => {
    it('returns the next joke', async () => {
      const nextJoke = { contents: 'next-joke' }
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(displayedJoke.index))
      jest.mocked(jokes).getJoke.mockResolvedValueOnce(nextJoke)
      result.current.nextJoke()
      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(displayedJoke.index + 1))
      await waitFor(() => expect(result.current.joke).toEqual(nextJoke))
    })
  })

  describe('nextRandomJoke', () => {
    it('returns the next random joke', async () => {
      const newIndex = 2
      const nextJoke = { contents: 'random-joke' }
      const { result } = renderHook(() => useJoke(newIndex), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(newIndex))
      jest.mocked(jokes).getJoke.mockResolvedValueOnce(nextJoke)
      result.current.nextRandomJoke()
      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(1))
      await waitFor(() => expect(result.current.joke).toEqual(nextJoke))
    })
  })

  describe('previousJoke', () => {
    it('returns the previous joke', async () => {
      const previousJoke = { contents: 'previous-joke' }
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(displayedJoke.index))
      jest.mocked(jokes).getJoke.mockResolvedValueOnce(previousJoke)
      result.current.previousJoke()
      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(displayedJoke.index - 1))
      await waitFor(() => expect(result.current.joke).toEqual(previousJoke))
    })
  })

  describe('resetErrorMessage', () => {
    it('resets the error message', async () => {
      jest.mocked(jokes).getJoke.mockRejectedValueOnce(new Error('Failed to fetch joke'))
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalled())
      await waitFor(() =>
        expect(result.current.errorMessage).toEqual('Error fetching joke. Please reload to try again.'),
      )
      result.current.resetErrorMessage()
      await waitFor(() => expect(result.current.errorMessage).toBeUndefined())
    })
  })

  describe('updateJoke', () => {
    it('updates the joke', async () => {
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(displayedJoke.index))
      result.current.updateJoke(jokeType)
      await waitFor(() => expect(result.current.joke).toEqual(jokeType))
    })

    it('returns an error message when reject patching joke', async () => {
      jest.mocked(jokes).patchJoke.mockRejectedValueOnce(new Error('Failed to patch joke'))
      const { result } = renderHook(() => useJoke(displayedJoke.index), { wrapper: Wrapper })

      await waitFor(() => expect(jokes.getJoke).toHaveBeenCalledWith(displayedJoke.index))
      await expect(result.current.updateJoke(jokeType)).rejects.toThrow('Failed to patch joke')
      await waitFor(() =>
        expect(result.current.errorMessage).toEqual('Error updating joke. Please reload to try again.'),
      )
    })
  })
})
