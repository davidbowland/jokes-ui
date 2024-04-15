import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mocked } from 'jest-mock'
import React from 'react'

import * as jokes from '@services/jokes'
import { index, jokeType } from '@test/__mocks__'
import Admin from '@components/admin'
import Joke from './index'
import { JokeType } from '@types'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/admin')
jest.mock('@services/jokes')

const baseUrl = process.env.GATSBY_JOKE_API_BASE_URL
const Wrapper = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
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
  const mockSetJoke = jest.fn()

  beforeAll(() => {
    mocked(Admin).mockImplementation(({ setJoke }) => {
      const setJokeArgs = mockSetJoke()
      if (setJokeArgs !== undefined) {
        const [joke, index] = setJokeArgs
        setJoke(joke, index)
      }
      return <>Admin</>
    })
    mocked(jokes).getJoke.mockResolvedValue(jokeType)
  })

  describe('joke display', () => {
    test('expect no joke rendered when initialJoke is omitted', async () => {
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} />
        </Wrapper>
      )

      expect(screen.queryByText(jokeType.contents)).not.toBeInTheDocument()
    })

    test('expect joke to be rendered when initialJoke is present', async () => {
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} initialJoke={jokeType} />
        </Wrapper>
      )

      expect(await screen.findByText(jokeType.contents)).toBeInTheDocument()
    })

    test('expect joke to be initialized when index passed', async () => {
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      expect(await screen.findByText(jokeType.contents)).toBeInTheDocument()
    })

    test('expect error message when getJoke rejects', async () => {
      mocked(jokes).getJoke.mockRejectedValueOnce(undefined)
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      expect(await screen.findByText(/Error fetching joke. Please reload to try again./i)).toBeInTheDocument()
    })

    test('expect closing error message removes it', async () => {
      mocked(jokes).getJoke.mockRejectedValueOnce(undefined)
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      await screen.findByText(/Error fetching joke. Please reload to try again./i)
      const closeSnackbarButton = (await screen.findByLabelText(/Close/i, { selector: 'button' })) as HTMLButtonElement
      act(() => {
        closeSnackbarButton.click()
      })

      expect(screen.queryByText(/Error fetching joke. Please reload to try again./i)).not.toBeInTheDocument()
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

    test('expect clicking the text-to-speech button plays joke audio', async () => {
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        ttsButton.click()
      })

      expect(global.Audio).toHaveBeenCalledWith('data:text/plain;base64,yalp')
      expect(screen.queryByText('Fetching audio')).toBeInTheDocument()
    })

    test('expect clicking the text-to-speech button fetches the joke tts', async () => {
      const jokeNoAudio: JokeType = { ...jokeType, audio: undefined }
      mocked(jokes).getJoke.mockResolvedValueOnce(jokeNoAudio)
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        ttsButton.click()
      })

      expect(global.Audio).toHaveBeenCalledWith(`${baseUrl}/jokes/${index}/tts`)
      expect(screen.queryByText('Fetching audio')).toBeInTheDocument()
    })

    test('expect clicking the text-to-speech button plays the tts', async () => {
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        ttsButton.click()
      })

      expect(mockPlay).toHaveBeenCalledTimes(1)
    })

    test('expect ending text-to-speech playback resets the Text-to-speech button', async () => {
      const endedEventCallback = (event: string, callback: any): void => {
        if (event === 'ended') {
          callback()
        }
      }
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      mockAddEventListener.mockImplementationOnce(endedEventCallback)
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        ttsButton.click()
      })

      expect(await screen.findByText('Text-to-speech')).toBeEnabled()
    })

    test('expect errors in text-to-speech playback resets the Text-to-speech button', async () => {
      const errorEventCallback = (event: string, callback: any): void => {
        if (event === 'error') {
          callback()
        }
      }
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      mockAddEventListener.mockImplementationOnce(errorEventCallback)
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      await screen.findByText(jokeType.contents)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        ttsButton.click()
      })

      expect(await screen.findByText('Text-to-speech')).toBeEnabled()
    })
  })

  describe('Admin', () => {
    test('expect Admin not to be rendered when initialJoke is present (wait for count)', async () => {
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} initialJoke={jokeType} />
        </Wrapper>
      )

      await screen.findByText(jokeType.contents)
      expect(mocked(Admin)).not.toHaveBeenCalled()
    })

    test('expect Admin to be rendered when index passed', async () => {
      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} />
        </Wrapper>
      )

      await screen.findByText(jokeType.contents)
      expect(mocked(Admin)).toHaveBeenCalledWith(expect.objectContaining({ index, joke: jokeType }), {})
    })

    test('expect setJoke updates the current joke', async () => {
      const newContents = 'Gibberish'
      const newJoke: JokeType = { ...jokeType, contents: newContents }
      mockSetJoke.mockReturnValueOnce([newJoke])

      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} initialJoke={jokeType} />
        </Wrapper>
      )

      expect(await screen.findByText(newContents)).toBeInTheDocument()
    })

    test('expect setJoke with an index invokes addJoke', async () => {
      const newContents = 'Gibberish'
      const newIndex = 76
      const newJoke: JokeType = { ...jokeType, contents: newContents }
      mockSetJoke.mockReturnValueOnce([newJoke, newIndex])

      render(
        <Wrapper>
          <Joke addJoke={mockAddJoke} index={index} initialJoke={jokeType} />
        </Wrapper>
      )

      expect(mockAddJoke).toHaveBeenCalledWith(newIndex)
    })
  })
})
