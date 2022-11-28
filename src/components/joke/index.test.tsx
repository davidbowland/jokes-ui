import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import React from 'react'
import { mocked } from 'jest-mock'

import * as jokes from '@services/jokes'
import { index, jokeType } from '@test/__mocks__'
import Admin from '@components/admin'
import Joke from './index'
import { JokeType } from '@types'
import Navigation from '@components/navigation'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/admin')
jest.mock('@components/navigation')
jest.mock('@services/jokes')

const baseUrl = process.env.GATSBY_JOKE_API_BASE_URL

describe('Joke component', () => {
  beforeAll(() => {
    mocked(Admin).mockReturnValue(<>Admin</>)
    mocked(Navigation).mockReturnValue(<>Navigation</>)
    mocked(jokes).getJoke.mockResolvedValue(jokeType)
  })

  describe('joke display', () => {
    test('expect no joke rendered by default', async () => {
      render(<Joke />)

      expect(screen.queryByText(jokeType.contents)).not.toBeInTheDocument()
    })

    test('expect joke to be initialized when index passed', async () => {
      render(<Joke index={index} />)

      expect(await screen.findByText(jokeType.contents)).toBeInTheDocument()
      expect(mocked(Admin)).toHaveBeenCalledWith(expect.objectContaining({ index, joke: jokeType }), {})
      expect(mocked(Navigation)).toHaveBeenCalledWith({ index }, {})
    })

    test('expect error message when getJoke rejects', async () => {
      mocked(jokes).getJoke.mockRejectedValueOnce(undefined)
      render(<Joke index={index} />)

      expect(await screen.findByText(/Error fetching joke. Please reload to try again./i)).toBeInTheDocument()
    })

    test('expect closing error message removes it', async () => {
      mocked(jokes).getJoke.mockRejectedValueOnce(undefined)
      render(<Joke index={index} />)

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

    test('expect clicking the Text-to-speech button plays joke audio', async () => {
      render(<Joke index={index} />)

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

    test('expect clicking the Text-to-speech button fetches the joke tts', async () => {
      const jokeNoAudio: JokeType = { ...jokeType, audio: undefined }
      mocked(jokes).getJoke.mockResolvedValueOnce(jokeNoAudio)
      render(<Joke index={index} />)

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

    test('expect clicking the Text-to-speech button plays the tts', async () => {
      render(<Joke index={index} />)

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
      render(<Joke index={index} />)

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
      render(<Joke index={index} />)

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
})
