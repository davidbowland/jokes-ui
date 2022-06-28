import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import React from 'react'
import { mocked } from 'jest-mock'

import * as jokeService from '@services/jokes'
import Admin from '@components/admin'
import Joke from './index'
import { JokeResponse } from '@types'

const baseUrl = process.env.GATSBY_JOKE_API_BASE_URL
jest.mock('@aws-amplify/analytics')
jest.mock('@components/admin')
jest.mock('@services/jokes')

describe('Joke component', () => {
  const joke1 = 'Ha'
  const joke2 = 'lol'
  const joke3 = '=)'
  const jokeResponse: JokeResponse[] = [
    { data: { contents: joke1 }, id: 33 },
    { data: { contents: joke2 }, id: 42 },
    { data: { contents: joke3 }, id: 70 },
  ]

  const consoleError = console.error

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0
    global.Math = mockMath

    console.error = jest.fn()
    mocked(Admin).mockReturnValue(<>Admin section</>)
    mocked(jokeService).getRandomJokes.mockResolvedValue(jokeResponse)
  })

  afterAll(() => {
    console.error = consoleError
  })

  describe('joke display', () => {
    test('expect no joke rendered by default', () => {
      render(<Joke />)

      expect(screen.getByText(/Loading.../i)).toBeDisabled()
      expect(screen.queryByText(joke1)).not.toBeInTheDocument()
    })

    test('expect joke to be initialized when prompted', async () => {
      render(<Joke initialize={true} />)

      expect(await screen.findByText(/Next joke/i)).not.toBeDisabled()
      expect(screen.getByText(joke1)).toBeInTheDocument()
    })
  })

  describe('next joke button', () => {
    test('expect clicking the Next Joke button changes the joke displayed', async () => {
      render(<Joke initialize={true} />)

      const nextJokeButton: HTMLButtonElement = (await screen.findByText(/Next joke/i)) as HTMLButtonElement
      expect(screen.queryAllByText(joke2).length).toBe(0)
      act(() => nextJokeButton.click())

      await screen.findByText(/Next joke/i)
      expect(nextJokeButton).not.toBeDisabled()
      expect(screen.getByText(joke2)).toBeInTheDocument()
    })

    test('expect clicking the Next Joke button calls getRandomJokes when jokes run out', async () => {
      mocked(jokeService).getRandomJokes.mockResolvedValueOnce([{ data: { contents: joke1 }, id: 33 }])
      render(<Joke initialize={true} />)

      const nextJokeButton: HTMLButtonElement = (await screen.findByText(/Next joke/i)) as HTMLButtonElement
      act(() => nextJokeButton.click())

      expect(nextJokeButton).not.toBeDisabled()
      expect(mocked(jokeService).getRandomJokes).toHaveBeenCalledWith([])
      expect(mocked(jokeService).getRandomJokes).toHaveBeenCalledWith(['33'])
    })

    test('expect error on getRandomJokes reject', async () => {
      mocked(jokeService).getRandomJokes.mockRejectedValueOnce('fake error')
      render(<Joke initialize={true} />)

      const errorButton: HTMLButtonElement = (await screen.findByText(/Error! Try again./)) as HTMLButtonElement
      expect(errorButton).not.toBeDisabled()
      expect(mocked(jokeService).getRandomJokes).toHaveBeenCalledTimes(1)
    })

    test('expect clicking error button retries fetch', async () => {
      mocked(jokeService).getRandomJokes.mockRejectedValueOnce('another error')
      render(<Joke initialize={true} />)

      const errorButton: HTMLButtonElement = (await screen.findByText(/Error! Try again./i)) as HTMLButtonElement
      act(() => errorButton.click())

      expect(await screen.findByText(/Next joke/i)).not.toBeDisabled()
      expect(screen.getByText(joke1)).toBeInTheDocument()
      expect(mocked(jokeService).getRandomJokes).toHaveBeenCalledTimes(2)
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

    test('expect clicking the Text-to-speech button fetches the joke tts', async () => {
      render(<Joke initialize={true} />)

      await screen.findByText(/Next joke/i)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i)) as HTMLButtonElement
      await act(async () => ttsButton.click())

      expect(global.Audio).toHaveBeenCalledWith(`${baseUrl}/jokes/33/tts`)
      expect(screen.queryByText('Fetching audio')).toBeInTheDocument()
    })

    test('expect clicking the Text-to-speech button plays the tts', async () => {
      render(<Joke initialize={true} />)

      await screen.findByText(/Next joke/i)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i)) as HTMLButtonElement
      await act(async () => ttsButton.click())

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
      render(<Joke initialize={true} />)

      await screen.findByText(/Next joke/i)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i)) as HTMLButtonElement
      await act(async () => ttsButton.click())

      expect(await screen.findByText('Text-to-speech')).toBeInTheDocument()
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
      render(<Joke initialize={true} />)

      await screen.findByText(/Next joke/i)
      const ttsButton: HTMLButtonElement = (await screen.findByText(/Text-to-speech/i)) as HTMLButtonElement
      await act(async () => ttsButton.click())

      expect(await screen.findByText('Text-to-speech')).toBeInTheDocument()
    })
  })

  describe('admin', () => {
    test('expect Admin component rendered', async () => {
      render(<Joke />)

      expect(mocked(Admin)).toHaveBeenCalledTimes(1)
      expect(screen.getByText(/Admin section/i)).toBeInTheDocument()
    })
  })
})
