import JokePage from '@pages/j/[id]'
import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import JokePageLayout from '@components/joke-page-layout'
import Navigation from '@components/navigation'

const testId = 'rnws6g7r'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke-page-layout')
jest.mock('@components/navigation')
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ asPath: '/j/rnws6g7r' }),
}))

describe('Joke page', () => {
  beforeAll(() => {
    jest.mocked(JokePageLayout).mockImplementation(({ children }) => <>{children}</>)
    jest.mocked(Navigation).mockReturnValue(<>Navigation</>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: `/j/${testId}` },
    })
  })

  it('renders Navigation with correct id', async () => {
    render(<JokePage />)
    await waitFor(() => {
      expect(Navigation).toHaveBeenCalledWith({ initialId: testId }, undefined)
    })
    expect(Navigation).toHaveBeenCalledTimes(1)
  })

  it('renders JokePageLayout', async () => {
    render(<JokePage />)
    await waitFor(() => {
      expect(JokePageLayout).toHaveBeenCalled()
    })
  })

  it('renders title', () => {
    render(<JokePage />)
    expect(document.title).toBe('Humor | dbowland.com')
  })
})
