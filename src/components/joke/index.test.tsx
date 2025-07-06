import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { index, jokeType } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import Joke from './index'
import Admin from '@components/admin'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/admin')

const baseUrl = process.env.GATSBY_JOKE_API_BASE_URL
const Wrapper = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
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

describe('Joke component', () => {
  const mockAddJoke = jest.fn()
  const mockGetTtsUrl = jest.fn()
  const mockUpdateJoke = jest.fn()

  beforeAll(() => {
    jest.mocked(Admin).mockImplementation(({ addJoke, updateJoke }) => {
      const addJokeArgs = mockAddJoke()
      if (addJokeArgs !== undefined) {
        const { joke } = addJokeArgs
        addJoke(joke)
      }

      const setJokeArgs = mockUpdateJoke()
      if (setJokeArgs !== undefined) {
        const { joke, index } = setJokeArgs
        updateJoke(joke, index)
      }
      return <>Admin</>
    })
    mockGetTtsUrl.mockReturnValue(`${baseUrl}/jokes/${index}/tts`)

    console.error = jest.fn()
  })

  describe('joke display', () => {
    it('does not render joke when it is undefined', async () => {
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={index}
          joke={undefined}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      expect(screen.queryByText(jokeType.contents)).not.toBeInTheDocument()
    })

    it('renders joke', async () => {
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={index}
          joke={jokeType}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      expect(await screen.findByText(jokeType.contents)).toBeInTheDocument()
    })
  })

  describe('text-to-speech', () => {
    const mockAddEventListener = jest.fn().mockImplementation((event, callback) => {
      if (event === 'canplaythrough') {
        callback()
      }
    })
    const mockPlay = jest.fn()

    beforeAll(() => {
      global.Audio = jest.fn().mockReturnValue({
        addEventListener: mockAddEventListener,
        play: mockPlay,
      })
    })

    it('fetches the joke tts when clicking the text-to-speech button', async () => {
      const user = userEvent.setup()
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={index}
          joke={jokeType}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await user.click(ttsButton)

      await waitFor(() => {
        expect(mockGetTtsUrl).toHaveBeenCalledWith(index)
      })
      expect(global.Audio).toHaveBeenCalledWith(`${baseUrl}/jokes/${index}/tts`)
      expect(await screen.findByText('Fetching audio')).toBeInTheDocument()
    })

    it('plays the tts when clicking the text-to-speech button', async () => {
      const user = userEvent.setup()
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={index}
          joke={jokeType}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await user.click(ttsButton)

      await waitFor(() => {
        expect(mockPlay).toHaveBeenCalledTimes(1)
      })
    })

    it('resets the Text-to-speech button when playback ends', async () => {
      const user = userEvent.setup()
      const mockAudioEnded = jest.fn()
      const endedEventCallback = (event: string, callback: any): void => {
        if (event === 'ended') {
          mockAudioEnded.mockImplementation(callback)
        }
      }
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={index}
          joke={jokeType}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await user.click(ttsButton)

      await screen.findByText('Fetching audio')
      act(() => {
        mockAudioEnded()
      })

      await waitFor(async () => {
        expect(await screen.findByText('Text-to-speech')).toBeEnabled()
      })
    })

    it('resets the Text-to-speech button when playback errors occur', async () => {
      const user = userEvent.setup()
      const mockAudioError = jest.fn()
      const errorEventCallback = (event: string, callback: any): void => {
        if (event === 'error') {
          mockAudioError.mockImplementation(callback)
        }
      }
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={index}
          joke={jokeType}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await user.click(ttsButton)

      await screen.findByText('Fetching audio')
      act(() => {
        mockAudioError()
      })

      await waitFor(async () => {
        expect(await screen.findByText('Text-to-speech')).toBeEnabled()
      })
      expect(console.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('Admin', () => {
    it('does not render Admin when index is missing', async () => {
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={undefined}
          joke={jokeType}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      await screen.findByText(jokeType.contents)
      expect(Admin).not.toHaveBeenCalled()
    })

    it('does not render Admin when joke is missing', async () => {
      render(
        <Joke
          addJoke={mockAddJoke}
          getTtsUrl={mockGetTtsUrl}
          index={index}
          joke={undefined}
          updateJoke={mockUpdateJoke}
        />,
        { wrapper: Wrapper },
      )

      expect(Admin).not.toHaveBeenCalled()
    })
  })
})
