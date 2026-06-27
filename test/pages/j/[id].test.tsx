import JokePage from '@pages/j/[id]'
import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import JokePageLayout from '@components/joke-page-layout'
import Navigation from '@components/navigation'

const testJokeIndex = 'qp8pzhqc'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke-page-layout')
jest.mock('@components/navigation')
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ asPath: '/j/qp8pzhqc' }),
}))

describe('Joke page', () => {
  beforeAll(() => {
    jest.mocked(JokePageLayout).mockImplementation(({ children }) => <>{children}</>)
    jest.mocked(Navigation).mockReturnValue(<>Navigation</>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '/j/qp8pzhqc' },
    })
  })

  it('renders Navigation with correct index', async () => {
    render(<JokePage />)
    await waitFor(() => {
      expect(Navigation).toHaveBeenCalledWith({ initialIndex: testJokeIndex }, undefined)
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
