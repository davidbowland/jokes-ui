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

const baseUrl = process.env.NEXT_PUBLIC_JOKE_API_BASE_URL
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
  const mockUpdateJoke = jest.fn()

  beforeAll(() => {
    jest.mocked(Admin).mockReturnValue(<>Admin</>)
    console.error = jest.fn()
  })

  describe('joke display', () => {
    it('does not render joke when it is undefined', async () => {
      render(<Joke addJoke={mockAddJoke} index={index} joke={undefined} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      expect(screen.queryByText(jokeType.contents)).not.toBeInTheDocument()
    })

    it('renders joke', async () => {
      render(<Joke addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      expect(await screen.findByText(jokeType.contents)).toBeInTheDocument()
    })
  })

  describe('text-to-speech', () => {
    const mockAddEventListener = jest.fn().mockImplementation((event: string, callback: () => void) => {
      ;(({ canplaythrough: callback }) as Record<string, () => void>)[event]?.()
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
      render(<Joke addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByLabelText(/Text-to-speech/i)) as HTMLButtonElement
      await user.click(ttsButton)

      await waitFor(() => {
        expect(global.Audio).toHaveBeenCalledWith(
          `data:${jokeType.audio!.contentType};base64,${jokeType.audio!.base64}`,
        )
      })
      expect(await screen.findByText('Fetching audio')).toBeInTheDocument()
    })

    it('uses API URL when no audio data is embedded', async () => {
      const jokeWithoutAudio = { contents: 'No audio joke' }
      const user = userEvent.setup()
      render(<Joke addJoke={mockAddJoke} index={index} joke={jokeWithoutAudio} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      await screen.findByText(jokeWithoutAudio.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByLabelText(/Text-to-speech/i)) as HTMLButtonElement
      await user.click(ttsButton)

      await waitFor(() => {
        expect(global.Audio).toHaveBeenCalledWith(`${baseUrl}/jokes/${index}/tts`)
      })
    })

    it('plays the tts when clicking the text-to-speech button', async () => {
      const user = userEvent.setup()
      render(<Joke addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByLabelText(/Text-to-speech/i)) as HTMLButtonElement
      await user.click(ttsButton)

      await waitFor(() => {
        expect(mockPlay).toHaveBeenCalledTimes(1)
      })
    })

    it('resets the Text-to-speech button when playback ends', async () => {
      const user = userEvent.setup()
      const mockAudioEnded = jest.fn()
      const endedEventCallback = (event: string, callback: any): void => {
        ;(({ ended: mockAudioEnded }) as Record<string, jest.Mock>)[event]?.mockImplementation(callback)
      }
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      render(<Joke addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByLabelText(/Text-to-speech/i)) as HTMLButtonElement
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
        ;(({ error: mockAudioError }) as Record<string, jest.Mock>)[event]?.mockImplementation(callback)
      }
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      render(<Joke addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByLabelText(/Text-to-speech/i)) as HTMLButtonElement
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
      render(<Joke addJoke={mockAddJoke} index={undefined} joke={jokeType} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      await screen.findByText(jokeType.contents)
      expect(Admin).not.toHaveBeenCalled()
    })

    it('does not render Admin when joke is missing', async () => {
      render(<Joke addJoke={mockAddJoke} index={index} joke={undefined} updateJoke={mockUpdateJoke} />, {
        wrapper: Wrapper,
      })

      expect(Admin).not.toHaveBeenCalled()
    })
  })
})
