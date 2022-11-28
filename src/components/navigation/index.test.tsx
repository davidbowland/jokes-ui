import '@testing-library/jest-dom'
import * as gatsby from 'gatsby'
import { act, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { mocked } from 'jest-mock'

import * as jokes from '@services/jokes'
import { index, jokeCount } from '@test/__mocks__'
import Navigation from './index'

jest.mock('@aws-amplify/analytics')
jest.mock('@services/jokes')
jest.mock('gatsby')

describe('Navigation component', () => {
  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0
    global.Math = mockMath

    mocked(jokes).getJokeCount.mockResolvedValue(jokeCount)
  })

  describe('count', () => {
    test('expect redering first joke shows all three navigation buttons', async () => {
      render(<Navigation index={index} />)

      expect(await screen.findByLabelText(/Random joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Previous joke/i)).toBeVisible()
      expect(await screen.findByLabelText(/Next joke/i)).toBeVisible()
    })

    test('expect error message when getJoke rejects', async () => {
      mocked(jokes).getJokeCount.mockRejectedValueOnce(undefined)
      render(<Navigation index={index} />)

      expect(
        await screen.findByText(/Error fetching joke navigation. Please refresh the page to try again./i)
      ).toBeInTheDocument()
    })

    test('expect closing error message removes it', async () => {
      mocked(jokes).getJokeCount.mockRejectedValueOnce(undefined)
      render(<Navigation index={index} />)

      await screen.findByText(/Error fetching joke navigation. Please refresh the page to try again./i)
      const closeSnackbarButton = (await screen.findByLabelText(/Close/i, { selector: 'button' })) as HTMLButtonElement
      act(() => {
        closeSnackbarButton.click()
      })

      expect(
        screen.queryByText(/Error fetching joke navigation. Please refresh the page to try again./i)
      ).not.toBeInTheDocument()
    })

    test('expect redering first joke show no previous button', async () => {
      render(<Navigation index={1} />)

      await screen.findByLabelText(/Random joke/i)
      expect(screen.queryByLabelText(/Previous joke/i)).not.toBeInTheDocument()
    })

    test('expect redering last joke shows no next button', async () => {
      render(<Navigation index={jokeCount.count} />)

      await screen.findByLabelText(/Random joke/i)
      expect(screen.queryByLabelText(/Next joke/i)).not.toBeInTheDocument()
    })
  })

  describe('previous', () => {
    test('expect clicking the previous joke button changes the joke displayed', async () => {
      render(<Navigation index={index} />)

      const previousJokeButton: HTMLButtonElement = (await screen.findByLabelText(
        /Previous joke/i
      )) as HTMLButtonElement
      act(() => {
        previousJokeButton.click()
      })

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith(`/j/${index - 1}`)
    })
  })

  describe('next', () => {
    test('expect clicking the next joke button changes the joke displayed', async () => {
      render(<Navigation index={index} />)

      const nextJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Next joke/i)) as HTMLButtonElement
      act(() => {
        nextJokeButton.click()
      })

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith(`/j/${index + 1}`)
    })
  })

  describe('random', () => {
    test('expect random joke loads when no index passed', async () => {
      render(<Navigation />)

      expect(mocked(jokes).getJokeCount).toHaveBeenCalled()
      await waitFor(() => expect(mocked(gatsby).navigate).toHaveBeenCalled())
      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/1')
    })

    test('expect clicking the random joke button changes the joke displayed', async () => {
      render(<Navigation index={index} />)

      const randomJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Random joke/i)) as HTMLButtonElement
      act(() => {
        randomJokeButton.click()
      })

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/1')
    })

    test('expect viewed jokes avoided', async () => {
      render(<Navigation index={1} />)

      const randomJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Random joke/i)) as HTMLButtonElement
      act(() => {
        randomJokeButton.click()
      })

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/2')
    })

    test('expect jokes start over when all have been viewed', async () => {
      mocked(jokes).getJokeCount.mockResolvedValueOnce({ count: 2 })
      render(<Navigation index={1} />)

      const randomJokeButton: HTMLButtonElement = (await screen.findByLabelText(/Random joke/i)) as HTMLButtonElement
      act(() => {
        randomJokeButton.click()
      })
      act(() => {
        randomJokeButton.click()
      })

      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/1')
      expect(mocked(gatsby).navigate).toHaveBeenCalledWith('/j/1')
    })
  })
})
