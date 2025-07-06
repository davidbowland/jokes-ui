import { index, jokeType } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import Navigation from './index'
import Joke from '@components/joke'
import { useJoke } from '@hooks/useJoke'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@hooks/useJoke')

describe('Navigation component', () => {
  const mockAddJoke = jest.fn()
  const replaceState = jest.fn()

  const mockUseJokeResult = {
    addJoke: jest.fn(),
    errorMessage: undefined,
    getTtsUrl: jest.fn(),
    hasNextJoke: true,
    hasPreviousJoke: true,
    index,
    joke: jokeType,
    nextJoke: jest.fn(),
    nextRandomJoke: jest.fn(),
    previousJoke: jest.fn(),
    resetErrorMessage: jest.fn(),
    updateJoke: jest.fn(),
  }

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = jest.fn().mockReturnValue(0.5)
    console.error = jest.fn()
    global.Math = mockMath
    window.history.replaceState = replaceState

    jest.mocked(Joke).mockImplementation(({ addJoke }) => {
      const index = mockAddJoke()
      if (index !== undefined) {
        addJoke(index)
      }
      return <>Joke</>
    })
    jest.mocked(useJoke).mockReturnValue(mockUseJokeResult)
    mockAddJoke.mockResolvedValue(62)
  })

  describe('rendering', () => {
    it('shows all three navigation buttons when available', async () => {
      render(<Navigation />)

      expect(await screen.findByLabelText(/Random joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Previous joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Next joke/i)).toBeVisible()
    })

    it('renders Joke with joke from useJoke', async () => {
      render(<Navigation initialCount={74} initialIndex={22} />)

      expect(useJoke).toHaveBeenCalledWith(22, 74)
      expect(Joke).toHaveBeenCalledWith(expect.objectContaining({ index, joke: jokeType }), {})
    })
  })

  describe('previous', () => {
    it('changes the joke displayed when clicking the previous joke button', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const previousJokeButton: HTMLButtonElement = (await screen.findByLabelText(
        /Previous joke/i,
      )) as HTMLButtonElement
      await user.click(previousJokeButton)

      await waitFor(() => {
        expect(mockUseJokeResult.previousJoke).toHaveBeenCalledTimes(1)
      })
    })

    it('removes previous joke navigation button when no previous jokes', async () => {
      jest.mocked(useJoke).mockReturnValue({ ...mockUseJokeResult, hasPreviousJoke: false })
      render(<Navigation />)

      expect(await screen.findByLabelText(/Random joke/i)).toBeVisible()
      expect(screen.queryByLabelText(/Previous joke/i)).not.toBeInTheDocument()
      expect(await screen.findByLabelText(/Next joke/i)).toBeInTheDocument()
    })
  })

  describe('next', () => {
    it('changes the joke displayed when clicking the next joke button', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const nextJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Next joke/i)) as HTMLButtonElement
      await user.click(nextJokeButton)

      await waitFor(() => {
        expect(mockUseJokeResult.nextJoke).toHaveBeenCalledTimes(1)
      })
    })

    it('removes next joke navigation button when no next jokes', async () => {
      jest.mocked(useJoke).mockReturnValue({ ...mockUseJokeResult, hasNextJoke: false })
      render(<Navigation />)

      expect(await screen.findByLabelText(/Random joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Previous joke/i)).toBeVisible()
      expect(screen.queryByLabelText(/Next joke/i)).not.toBeInTheDocument()
    })
  })

  describe('random', () => {
    it('loads random joke when no index is passed', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const randomJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Random joke/i)) as HTMLButtonElement
      await user.click(randomJokeButton)

      await waitFor(() => {
        expect(mockUseJokeResult.nextRandomJoke).toHaveBeenCalledTimes(1)
      })
    })

    it('removes all navigation buttons when no joke', async () => {
      jest.mocked(useJoke).mockReturnValue({ ...mockUseJokeResult, joke: undefined })
      render(<Navigation />)

      expect(screen.queryByLabelText(/Random joke/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Previous joke/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Next joke/i)).not.toBeInTheDocument()
    })
  })
})
