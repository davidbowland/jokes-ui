import { index, jokeType, user } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Auth } from 'aws-amplify'
import React from 'react'

import Admin from './index'

jest.mock('aws-amplify')
jest.mock('@aws-amplify/analytics')
const mockSignOut = jest.fn()
jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: jest.fn().mockImplementation(({ children }) => children({ signOut: mockSignOut }) ?? null),
}))

describe('Admin component', () => {
  const mockAddJoke = jest.fn()
  const mockUpdateJoke = jest.fn()

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = jest.fn().mockReturnValue(0)
    global.Math = mockMath
    console.error = jest.fn()

    jest.mocked(Auth).currentAuthenticatedUser.mockResolvedValue(user)
  })

  it('shows nothing to logged out users', async () => {
    jest.mocked(Auth).currentAuthenticatedUser.mockRejectedValueOnce(undefined)
    render(<Admin addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />)

    expect(screen.queryByText(/joke/i)).not.toBeInTheDocument()
  })

  it('shows the edit joke feature to logged in users', async () => {
    render(<Admin addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />)

    expect(await screen.findByText(/Update joke/i, { selector: 'button' })).toBeInTheDocument()
    const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #42/i)) as HTMLInputElement
    expect(updateTextInput.value.length).toBeGreaterThan(0)
  })

  it('navigates to the add screen when "Add joke" is clicked', async () => {
    render(<Admin addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />)

    const editLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
    userEvent.click(editLabel)

    const addJokeButtons: HTMLButtonElement[] = (await screen.findAllByText(/Add joke/i, {
      selector: 'button',
    })) as HTMLButtonElement[]
    expect(addJokeButtons.length).toEqual(1)
    const addTextInput: HTMLInputElement = (await screen.findByLabelText('Joke to add')) as HTMLInputElement
    expect(addTextInput.value.length).toEqual(0)
  })

  it('invokes joke service when "Add joke" is clicked', async () => {
    mockAddJoke.mockResolvedValueOnce(17)
    render(<Admin addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />)

    const addLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
    userEvent.click(addLabel)
    const addTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke to add/i)) as HTMLInputElement
    await userEvent.type(addTextInput, jokeType.contents)
    const addJokeButton: HTMLButtonElement = (
      await screen.findAllByText(/Add joke/i, {
        selector: 'button',
      })
    )[1] as HTMLButtonElement
    userEvent.click(addJokeButton)

    await waitFor(() => {
      expect(mockAddJoke).toHaveBeenCalled()
    })
    expect(mockAddJoke).toHaveBeenCalledWith({ contents: jokeType.contents })
    expect(await screen.findByText('Created joke #17')).toBeInTheDocument()
  })

  it('displays an error message when there is a failure adding a joke', async () => {
    mockAddJoke.mockRejectedValueOnce({ response: 'fnord' })
    render(<Admin addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />)

    const addLabel: HTMLLabelElement = (await screen.findByText(/Add joke/i)) as HTMLLabelElement
    userEvent.click(addLabel)
    const addTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke to add/i)) as HTMLInputElement
    await userEvent.type(addTextInput, jokeType.contents)
    const addJokeButton: HTMLButtonElement = (
      await screen.findAllByText(/Add joke/i, {
        selector: 'button',
      })
    )[1] as HTMLButtonElement
    userEvent.click(addJokeButton)

    expect(await screen.findByText('fnord')).toBeInTheDocument()
  })

  it('edits the current joke and invokes the joke service', async () => {
    const expectedJoke = 'fnord'
    render(<Admin addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />)

    const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #42/i)) as HTMLInputElement
    userEvent.clear(updateTextInput)
    await userEvent.type(updateTextInput, expectedJoke)
    const updateJokeButton: HTMLButtonElement = (await screen.findByText(/Update joke/i, {
      selector: 'button',
    })) as HTMLButtonElement
    userEvent.click(updateJokeButton)

    expect(await screen.findByText('Joke successfully updated!')).toBeInTheDocument()
    expect(mockUpdateJoke).toHaveBeenCalledWith({ contents: expectedJoke })
    expect(mockUpdateJoke).toHaveBeenCalledTimes(1)
  })

  it("doesn't affect audio when editing a joke with no local audio", async () => {
    const expectedJoke = 'fnord'
    const noAudioJoke = { ...jokeType, audio: undefined }
    render(<Admin addJoke={mockAddJoke} index={index} joke={noAudioJoke} updateJoke={mockUpdateJoke} />)

    const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #42/i)) as HTMLInputElement
    await userEvent.clear(updateTextInput)
    await userEvent.type(updateTextInput, expectedJoke)
    const updateJokeButton: HTMLButtonElement = (await screen.findByText(/Update joke/i, {
      selector: 'button',
    })) as HTMLButtonElement
    userEvent.click(updateJokeButton)

    expect(await screen.findByText('Joke successfully updated!')).toBeInTheDocument()
    expect(mockUpdateJoke).toHaveBeenCalledWith({ contents: expectedJoke })
    expect(mockUpdateJoke).toHaveBeenCalledTimes(1)
  })

  it('displays an error message when there is a failure editing the joke', async () => {
    mockUpdateJoke.mockRejectedValueOnce({ response: 'fnord' })
    render(<Admin addJoke={mockAddJoke} index={index} joke={jokeType} updateJoke={mockUpdateJoke} />)

    const updateTextInput: HTMLInputElement = (await screen.findByLabelText(/Joke #42/i)) as HTMLInputElement
    await userEvent.type(updateTextInput, 'funny joke')
    const updateJokeButton: HTMLButtonElement = (await screen.findByText(/Update joke/i, {
      selector: 'button',
    })) as HTMLButtonElement
    userEvent.click(updateJokeButton)

    expect(await screen.findByText('fnord')).toBeInTheDocument()
  })
})
