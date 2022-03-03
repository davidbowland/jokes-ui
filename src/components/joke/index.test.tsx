import { mocked } from 'jest-mock'
import React from 'react'
import '@testing-library/jest-dom'
import { act, screen, render } from '@testing-library/react'

import Joke from './index'
import Admin from '@components/admin'
import * as jokeService from '@services/jokes'
import { JokeResponse } from '@types'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/admin')
jest.mock('@services/jokes')

describe('Joke component', () => {
  const joke1 = 'Ha'
  const joke2 = 'lol'
  const joke3 = '=)'
  const jokeResponse: JokeResponse = { 33: { contents: joke1 }, 42: { contents: joke2 }, 70: { contents: joke3 } }

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

  test('expect no joke rendered by default', () => {
    render(<Joke />)

    expect(screen.getByText(/Loading.../i)).toBeDisabled()
    expect(() => screen.getByText(joke1)).toThrow()
  })

  test('expect joke to be initialized when prompted', async () => {
    render(<Joke initialize={true} />)

    expect(await screen.findByText(/Next joke/i)).not.toBeDisabled()
    expect(screen.getByText(joke1)).toBeInTheDocument()
  })

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
    mocked(jokeService).getRandomJokes.mockResolvedValueOnce({ 33: { contents: joke1 } })
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

  test('expect Admin component rendered', async () => {
    render(<Joke />)

    expect(mocked(Admin)).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/Admin section/i)).toBeInTheDocument()
  })
})
