import '@testing-library/jest-dom'
import * as gatsby from 'gatsby'
import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import * as jokes from '@services/jokes'
import { index, initialJoke, initialResponse, jokeCount } from '@test/__mocks__'
import Joke from '@components/joke'
import Navigation from './index'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@services/jokes')
jest.mock('gatsby')

describe('Navigation component', () => {
  const mockAddJoke = jest.fn()
  const replaceState = jest.fn()

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = jest.fn().mockReturnValue(0.5)
    console.error = jest.fn()
    global.Math = mockMath
    window.history.replaceState = replaceState

    mocked(Joke).mockImplementation(({ addJoke }) => {
      const index = mockAddJoke()
      if (index !== undefined) {
        addJoke(index)
      }
      return <>Joke</>
    })
    mocked(jokes).getInitialData.mockResolvedValue(initialResponse)
    mocked(jokes).getJokeCount.mockResolvedValue(jokeCount)
  })

  describe('rendering', () => {
    test('expect rendering initial joke shows all three navigation buttons', async () => {
      render(<Navigation initialIndex={index} />)

      expect(await screen.findByLabelText(/Random joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Previous joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Next joke/i)).toBeVisible()
    })

    test('expect Joke rendered with initialIndex', async () => {
      render(<Navigation initialIndex={index} />)

      await screen.findByLabelText(/Random joke/i)
      expect(Joke).toHaveBeenCalledWith(expect.objectContaining({ index, initialJoke: undefined }), {})
    })

    test('expect Joke rendered without initialIndex', async () => {
      render(<Navigation />)

      await screen.findByLabelText(/Random joke/i)
      expect(Joke).toHaveBeenCalledWith(expect.objectContaining({ index, initialJoke }), {})
    })
  })

  describe('getInitialData', () => {
    test('expect getInitialData called when initialIndex is omitted', async () => {
      render(<Navigation />)

      await screen.findByLabelText(/Random joke/i)
      expect(mocked(jokes).getInitialData).toHaveBeenCalled()
      expect(mocked(jokes).getJokeCount).not.toHaveBeenCalled()
    })

    test('expect error message when getInitialData rejects', async () => {
      mocked(jokes).getInitialData.mockRejectedValueOnce(undefined)
      render(<Navigation />)

      expect(
        await screen.findByText(/Error fetching initial joke data. Please reload to try again./i)
      ).toBeInTheDocument()
    })

    test('expect closing getInitialData error message removes it', async () => {
      mocked(jokes).getInitialData.mockRejectedValueOnce(undefined)
      render(<Navigation />)

      await screen.findByText(/Error fetching initial joke data. Please reload to try again./i)
      const closeSnackbarButton = (await screen.findByLabelText(/Close/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(closeSnackbarButton)

      expect(
        screen.queryByText(/Error fetching initial joke data. Please reload to try again./i)
      ).not.toBeInTheDocument()
    })
  })

  describe('getJokeCount', () => {
    test('expect getJokeCount called when initialIndex is provided', async () => {
      render(<Navigation initialIndex={index} />)

      await screen.findByLabelText(/Random joke/i)
      expect(mocked(jokes).getJokeCount).toHaveBeenCalled()
      expect(mocked(jokes).getInitialData).not.toHaveBeenCalled()
    })

    test('expect error message when getJokeCount rejects', async () => {
      mocked(jokes).getJokeCount.mockRejectedValueOnce(undefined)
      render(<Navigation initialIndex={index} />)

      expect(await screen.findByText(/Error fetching joke count. Please reload to try again./i)).toBeInTheDocument()
    })

    test('expect closing getJokeCount error message removes it', async () => {
      mocked(jokes).getJokeCount.mockRejectedValueOnce(undefined)
      render(<Navigation initialIndex={index} />)

      await screen.findByText(/Error fetching joke count. Please reload to try again./i)
      const closeSnackbarButton = (await screen.findByLabelText(/Close/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(closeSnackbarButton)

      expect(screen.queryByText(/Error fetching joke count. Please reload to try again../i)).not.toBeInTheDocument()
    })
  })

  describe('previous', () => {
    test('expect clicking the previous joke button changes the joke displayed', async () => {
      render(<Navigation initialIndex={index} />)

      const previousJokeButton: HTMLButtonElement = (await screen.findByLabelText(
        /Previous joke/i
      )) as HTMLButtonElement
      fireEvent.click(previousJokeButton)

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith(`/j/${index - 1}`, { state: jokeCount })
    })

    test('expect rendering first joke shows no previous button', async () => {
      render(<Navigation initialIndex={1} />)

      await screen.findByLabelText(/Random joke/i)
      expect(screen.queryByLabelText(/Previous joke/i)).not.toBeInTheDocument()
    })
  })

  describe('next', () => {
    test('expect clicking the next joke button changes the joke displayed', async () => {
      render(<Navigation initialIndex={index} />)

      const nextJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Next joke/i)) as HTMLButtonElement
      fireEvent.click(nextJokeButton)

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith(`/j/${index + 1}`, { state: jokeCount })
    })

    test('expect rendering last joke shows no next button', async () => {
      render(<Navigation initialIndex={jokeCount.count} />)

      await screen.findByLabelText(/Random joke/i)
      expect(screen.queryByLabelText(/Next joke/i)).not.toBeInTheDocument()
    })
  })

  describe('random', () => {
    test('expect random joke loads when no index passed', async () => {
      render(<Navigation />)

      await screen.findByLabelText(/Random joke/i)
      expect(mocked(jokes).getInitialData).toHaveBeenCalled()
      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/42', { replace: true, state: jokeCount })
    })

    test('expect clicking the random joke button changes the joke displayed', async () => {
      render(<Navigation initialIndex={index} />)

      const randomJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Random joke/i)) as HTMLButtonElement
      fireEvent.click(randomJokeButton)

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/65', { state: jokeCount })
    })

    test('expect viewed jokes avoided', async () => {
      render(<Navigation initialIndex={65} />)

      const randomJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Random joke/i)) as HTMLButtonElement
      fireEvent.click(randomJokeButton)

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/64', { state: jokeCount })
    })

    test('expect jokes start over when all have been viewed', async () => {
      const count = 2
      mocked(jokes).getJokeCount.mockResolvedValueOnce({ count })
      render(<Navigation initialIndex={1} />)

      const randomJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Random joke/i)) as HTMLButtonElement
      fireEvent.click(randomJokeButton)
      fireEvent.click(randomJokeButton)

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/2', { state: { count } })
      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/2', { state: { count } })
    })
  })

  describe('addJoke', () => {
    test('expect adding a joke changes the joke index', () => {
      const newIndex = 724
      mockAddJoke.mockReturnValueOnce(newIndex)
      render(<Navigation initialIndex={index} />)

      expect(Joke).toHaveBeenCalledWith(expect.objectContaining({ index, initialJoke: undefined }), {})
      expect(Joke).toHaveBeenCalledWith(expect.objectContaining({ index: newIndex, initialJoke: undefined }), {})
    })
  })
})
