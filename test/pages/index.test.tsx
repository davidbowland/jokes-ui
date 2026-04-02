import IndexPage from '@pages/index'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import JokePageLayout from '@components/joke-page-layout'
import Navigation from '@components/navigation'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke-page-layout')
jest.mock('@components/navigation')
jest.mock('aws-amplify')

describe('Index page', () => {
  beforeAll(() => {
    jest.mocked(JokePageLayout).mockImplementation(({ children }) => <>{children}</>)
    jest.mocked(Navigation).mockReturnValue(<>Navigation</>)
  })

  it('renders Navigation', () => {
    render(<IndexPage />)
    expect(Navigation).toHaveBeenCalledWith({}, undefined)
    expect(Navigation).toHaveBeenCalledTimes(1)
  })

  it('renders JokePageLayout', () => {
    render(<IndexPage />)
    expect(JokePageLayout).toHaveBeenCalledTimes(1)
  })

  it('renders title', () => {
    render(<IndexPage />)
    expect(document.title).toBe('Humor | dbowland.com')
  })
})
