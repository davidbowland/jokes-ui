import { jokeId, jokeType } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import Navigation from './index'
import Joke from '@components/joke'
import { useJokeMutations } from '@hooks/useJokeMutations'
import { useJokeNavigation } from '@hooks/useJokeNavigation'
import { useJokeQuery } from '@hooks/useJokeQuery'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@hooks/useJokeMutations')
jest.mock('@hooks/useJokeNavigation')
jest.mock('@hooks/useJokeQuery')
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}))

describe('Navigation component', () => {
  const replaceState = jest.fn()

  const mockNavigation = {
    canGoBack: true,
    canGoForward: true,
    errorMessage: undefined,
    goBack: jest.fn(),
    goForward: jest.fn(),
    goRandom: jest.fn(),
    id: jokeId,
    resetErrorMessage: jest.fn(),
  }

  const mockMutations = {
    addJoke: jest.fn(),
    errorMessage: undefined,
    resetErrorMessage: jest.fn(),
    updateJoke: jest.fn(),
  }

  beforeAll(() => {
    console.error = jest.fn()
    window.history.replaceState = replaceState

    jest.mocked(Joke).mockReturnValue(<>Joke</>)
    jest.mocked(useJokeNavigation).mockReturnValue(mockNavigation)
    jest.mocked(useJokeQuery).mockReturnValue({ error: null, joke: jokeType })
    jest.mocked(useJokeMutations).mockReturnValue(mockMutations)
  })

  describe('rendering', () => {
    it('shows back, random, and forward navigation buttons', async () => {
      render(<Navigation />)

      expect(await screen.findByLabelText(/Go back/i)).toBeVisible()
      expect(await screen.findByLabelText(/Random joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Go forward/i)).toBeVisible()
    })

    it('renders Joke with joke from hooks', async () => {
      render(<Navigation initialId={jokeId} />)

      expect(useJokeNavigation).toHaveBeenCalledWith(jokeId)
      expect(Joke).toHaveBeenCalledWith(expect.objectContaining({ id: jokeId, joke: jokeType }), undefined)
    })
  })

  describe('back', () => {
    it('calls goBack when clicking the back button', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const backButton = await screen.findByLabelText(/Go back/i)
      await user.click(backButton)

      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalledTimes(1)
      })
    })

    it('disables back button when no history', async () => {
      jest.mocked(useJokeNavigation).mockReturnValue({ ...mockNavigation, canGoBack: false })
      render(<Navigation />)

      expect(await screen.findByLabelText(/Go back/i)).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('forward', () => {
    it('calls goForward when clicking the forward button', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const forwardButton = await screen.findByLabelText(/Go forward/i)
      await user.click(forwardButton)

      await waitFor(() => {
        expect(mockNavigation.goForward).toHaveBeenCalledTimes(1)
      })
    })

    it('disables forward button when no forward history', async () => {
      jest.mocked(useJokeNavigation).mockReturnValue({ ...mockNavigation, canGoForward: false })
      render(<Navigation />)

      expect(await screen.findByLabelText(/Go forward/i)).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('random', () => {
    it('calls goRandom when clicking the random button', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const randomButton = await screen.findByLabelText(/Random joke/i)
      await user.click(randomButton)

      await waitFor(() => {
        expect(mockNavigation.goRandom).toHaveBeenCalledTimes(1)
      })
    })

    it('disables random button when no joke loaded', async () => {
      jest.mocked(useJokeQuery).mockReturnValue({ error: null, joke: undefined })
      render(<Navigation />)

      expect(await screen.findByLabelText(/Random joke/i)).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('URL update', () => {
    it('updates the URL when id changes', async () => {
      render(<Navigation />)

      await waitFor(() => {
        expect(replaceState).toHaveBeenCalledWith(null, '', `/j/${jokeId}`)
      })
    })
  })
})
