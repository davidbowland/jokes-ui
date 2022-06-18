import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Auth } from 'aws-amplify'
import React from 'react'
import { mocked } from 'jest-mock'

import * as jokeService from '@services/jokes'
import Admin from './index'
import { DisplayedJoke } from '@types'
import { user } from '@test/__mocks__'

jest.mock('aws-amplify')
jest.mock('@aws-amplify/analytics')
const mockSignOut = jest.fn()
jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: jest.fn().mockImplementation(({ children }) => children({ signOut: mockSignOut }) ?? null),
}))
jest.mock('@services/jokes')

describe('Admin component', () => {
  const adminJoke: DisplayedJoke = { contents: 'rofl', index: 33 }

  const consoleError = console.error
  const setJoke = jest.fn()

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0
    global.Math = mockMath

    console.error = jest.fn()
    mocked(Auth).currentAuthenticatedUser.mockResolvedValue(user)
    mocked(jokeService).postJoke.mockResolvedValue({ index: '62' })
  })

  afterAll(() => {
    console.error = consoleError
  })

  test('expect being logged out shows nothing', async () => {
    mocked(Auth).currentAuthenticatedUser.mockRejectedValueOnce(undefined)
    render(<Admin joke={adminJoke} setJoke={setJoke} />)

    expect(screen.queryByText(/joke/i)).not.toBeInTheDocument()
  })

  test('expect being logged in shows edit joke feature and populates input text', async () => {
    render(<Admin joke={adminJoke} setJoke={setJoke} />)

    expect(await screen.findByText(/Update joke/i, { selector: 'button' })).toBeInTheDocument()
    const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #33/i)) as HTMLInputElement
    expect(updateTextInput.value.length).toBeGreaterThan(0)
  })

  test('expect clicking "Add joke" changes to the add screen', async () => {
    render(<Admin joke={adminJoke} setJoke={setJoke} />)

    const editLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
    act(() => editLabel.click())

    const addJokeButtons: HTMLButtonElement[] = (await screen.findAllByText(/Add joke/i, {
      selector: 'button',
    })) as HTMLButtonElement[]
    expect(addJokeButtons.length).toEqual(2)
    const addTextInput: HTMLInputElement = (await screen.findByLabelText('Joke to add')) as HTMLInputElement
    expect(addTextInput.value.length).toEqual(0)
  })

  test('expect clicking "Add joke" invokes the joke service', async () => {
    mocked(jokeService).postJoke.mockResolvedValueOnce({ index: '17' })
    render(<Admin joke={adminJoke} setJoke={setJoke} />)

    const addLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
    act(() => {
      addLabel.click()
    })

    const addTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke to add/i)) as HTMLInputElement
    act(() => {
      fireEvent.change(addTextInput, { target: { value: adminJoke.contents } })
    })
    const addJokeButton: HTMLButtonElement = (
      await screen.findAllByText(/Add joke/i, {
        selector: 'button',
      })
    )[1] as HTMLButtonElement
    await act(async () => {
      await addJokeButton.click()
    })

    expect(mocked(jokeService).postJoke).toBeCalledWith(expect.objectContaining({ contents: adminJoke.contents }))
    expect(mocked(jokeService).postJoke).toBeCalledTimes(1)
    expect(screen.getByText('Created joke #17')).toBeInTheDocument()
  })

  test('expect failing add joke service displays message', async () => {
    mocked(jokeService).postJoke.mockRejectedValueOnce({ response: 'fnord' })
    render(<Admin joke={adminJoke} setJoke={setJoke} />)

    const addLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
    act(() => {
      addLabel.click()
    })

    const addTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke to add/i)) as HTMLInputElement
    act(() => {
      fireEvent.change(addTextInput, { target: { value: adminJoke.contents } })
    })
    const addJokeButton: HTMLButtonElement = (
      await screen.findAllByText(/Add joke/i, {
        selector: 'button',
      })
    )[1] as HTMLButtonElement
    await act(async () => {
      await addJokeButton.click()
    })

    expect(screen.getByText('fnord')).toBeInTheDocument()
  })

  test('expect editing the current joke and clicking the button invokes the joke service', async () => {
    const expectedJoke = 'fnord'
    render(<Admin joke={adminJoke} setJoke={setJoke} />)

    const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #33/i)) as HTMLInputElement
    act(() => {
      fireEvent.change(updateTextInput, { target: { value: expectedJoke } })
    })
    act(() => {
      fireEvent.change(updateTextInput, { target: { value: expectedJoke } })
    })
    const updateJokeButton: HTMLButtonElement = (await screen.findByText(/Update joke/i, {
      selector: 'button',
    })) as HTMLButtonElement
    await act(async () => {
      await updateJokeButton.click()
    })

    expect(mocked(jokeService).patchJoke).toBeCalledWith(33, [
      { op: 'test', path: '/contents', value: 'rofl' },
      { op: 'replace', path: '/contents', value: expectedJoke },
    ])
    expect(mocked(jokeService).patchJoke).toBeCalledTimes(1)
    expect(screen.getByText('Joke successfully updated!')).toBeInTheDocument()
  })

  test('expect failing edit joke service displays message', async () => {
    mocked(jokeService).patchJoke.mockRejectedValueOnce({ response: 'fnord' })
    render(<Admin joke={adminJoke} setJoke={setJoke} />)

    const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #33/i)) as HTMLInputElement
    act(() => {
      fireEvent.change(updateTextInput, { target: { value: 'funny joke' } })
    })
    const updateJokeButton: HTMLButtonElement = (await screen.findByText(/Update joke/i, {
      selector: 'button',
    })) as HTMLButtonElement
    await act(async () => {
      await updateJokeButton.click()
    })

    expect(screen.getByText('fnord')).toBeInTheDocument()
  })

  test('expect missing joke shows unable to load jokes', async () => {
    render(<Admin joke={undefined} setJoke={setJoke} />)

    expect(await screen.findByText(/Unable to load jokes/i)).toBeInTheDocument()
  })
})
