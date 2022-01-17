import React from 'react'
import '@testing-library/jest-dom'
import { act, fireEvent, screen, render } from '@testing-library/react'

import Joke from './index'
import JokeService, { JokeResponse } from '@services/jokes'

const mockSignOut = jest.fn()
jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: jest.fn().mockImplementation(({ children }) => children({ signOut: mockSignOut }) ?? null),
}))
jest.mock('@services/jokes')

describe('Joke component', () => {
  const joke1 = 'Ha'
  const joke2 = 'lol'
  const joke3 = '=)'
  const jokeResponse: JokeResponse = { 33: { contents: joke1 }, 42: { contents: joke2 }, 70: { contents: joke3 } }

  const consoleError = console.error
  const getRandomJokes = jest.fn().mockResolvedValue(jokeResponse)

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0
    global.Math = mockMath

    console.error = jest.fn()
    JokeService.getRandomJokes = getRandomJokes
  })

  afterAll(() => {
    console.error = consoleError
  })

  describe('Public functionality', () => {
    test('Rendering Joke renders no joke by default, for static rendering', () => {
      render(<Joke />)

      expect(screen.getByText(/Loading.../i)).toBeDisabled()
      expect(() => screen.getByText(joke1)).toThrow()
    })

    test('Rendering Joke displays a joke', async () => {
      render(<Joke initialize={true} />)

      expect(await screen.findByText(/Next joke/i)).not.toBeDisabled()
      expect(screen.getByText(joke1)).toBeInTheDocument()
    })

    test('Clicking the Next Joke button changes the joke displayed', async () => {
      render(<Joke initialize={true} />)

      const nextJokeButton: HTMLButtonElement = (await screen.findByText(/Next joke/i)) as HTMLButtonElement
      expect(screen.queryAllByText(joke2).length).toBe(0)
      act(() => nextJokeButton.click())

      await screen.findByText(/Next joke/i)
      expect(nextJokeButton).not.toBeDisabled()
      expect(screen.getByText(joke2)).toBeInTheDocument()
    })

    test('Clicking the Next Joke button calls getRandomJokes when jokes run out', async () => {
      getRandomJokes.mockResolvedValueOnce({ 33: { contents: joke1 } })
      render(<Joke initialize={true} />)

      const nextJokeButton: HTMLButtonElement = (await screen.findByText(/Next joke/i)) as HTMLButtonElement
      act(() => nextJokeButton.click())

      expect(nextJokeButton).not.toBeDisabled()
      expect(getRandomJokes).toHaveBeenCalledTimes(2)
    })

    test('Ensure error on getRandomJokes reject', async () => {
      getRandomJokes.mockRejectedValueOnce('fake error')
      render(<Joke initialize={true} />)

      const errorButton: HTMLButtonElement = (await screen.findByText(/Error! Try again./)) as HTMLButtonElement
      expect(errorButton).not.toBeDisabled()
      expect(getRandomJokes).toHaveBeenCalledTimes(1)
    })

    test('Clicking error button retries fetch', async () => {
      getRandomJokes.mockRejectedValueOnce('another error')
      render(<Joke initialize={true} />)

      const errorButton: HTMLButtonElement = (await screen.findByText(/Error! Try again./i)) as HTMLButtonElement
      act(() => errorButton.click())

      expect(await screen.findByText(/Next joke/i)).not.toBeDisabled()
      expect(screen.getByText(joke1)).toBeInTheDocument()
      expect(getRandomJokes).toHaveBeenCalledTimes(2)
    })
  })

  describe('Admin functionality', () => {
    const adminJoke = 'rofl'
    const postJoke = jest.fn().mockResolvedValue({ id: '62' })
    const putJoke = jest.fn()

    beforeAll(() => {
      JokeService.postJoke = postJoke
      JokeService.putJoke = putJoke
    })

    test('Being logged in shows edit joke feature and populates input text', async () => {
      render(<Joke initialize={true} />)

      expect(await screen.findByText(/Update joke/i, { selector: 'button' })).toBeInTheDocument()
      const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #33/i)) as HTMLInputElement
      expect(updateTextInput.value.length).toBeGreaterThan(0)
    })

    test('Clicking "Add joke" changes to the add screen', async () => {
      render(<Joke initialize={true} />)

      const editLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
      act(() => editLabel.click())

      const addJokeButtons: HTMLButtonElement[] = (await screen.findAllByText(/Add joke/i, {
        selector: 'button',
      })) as HTMLButtonElement[]
      expect(addJokeButtons.length).toEqual(2)
      const addTextInput: HTMLInputElement = (await screen.findByLabelText('Joke to add')) as HTMLInputElement
      expect(addTextInput.value.length).toEqual(0)
    })

    test('Clicking "Add joke" invokes the joke service', async () => {
      render(<Joke initialize={true} />)

      const addLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
      await act(async () => {
        await addLabel.click()
      })

      const addTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke to add/i)) as HTMLInputElement
      act(() => {
        fireEvent.change(addTextInput, { target: { value: adminJoke } })
      })
      const addJokeButton: HTMLButtonElement = (
        await screen.findAllByText(/Add joke/i, {
          selector: 'button',
        })
      )[1] as HTMLButtonElement
      await act(async () => {
        await addJokeButton.click()
      })

      expect(postJoke).toBeCalledWith(expect.objectContaining({ contents: adminJoke }))
      expect(postJoke).toBeCalledTimes(1)
    })

    test('Editing the current joke and clicking the button invokes the joke service', async () => {
      const expectedIndex = Object.keys(jokeResponse)[0]
      render(<Joke initialize={true} />)

      const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #33/i)) as HTMLInputElement
      expect(updateTextInput.value).not.toEqual(joke2)
      act(() => {
        fireEvent.change(updateTextInput, { target: { value: joke2 } })
      })
      const updateJokeButton: HTMLButtonElement = (await screen.findByText(/Update joke/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await updateJokeButton.click()
      })

      expect(putJoke).toBeCalledWith(expectedIndex, expect.objectContaining({ contents: joke2 }))
      expect(putJoke).toBeCalledTimes(1)
    })
  })
})
