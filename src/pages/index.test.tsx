import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Authenticated from '@components/auth'
import Humor from './index'
import Joke from '@components/joke'
import Themed from '@components/themed'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/auth')
jest.mock('@components/joke')
jest.mock('@components/themed')

describe('Humor page', () => {
  beforeAll(() => {
    mocked(Authenticated).mockImplementation(({ children }) => <>{children}</>)
    mocked(Joke).mockReturnValue(<></>)
    mocked(Themed).mockImplementation(({ children }) => <>{children}</>)
  })

  test('expect rendering Humor renders Joke', () => {
    render(<Humor />)
    expect(mocked(Joke)).toHaveBeenCalledWith({ initialize: true }, expect.anything())
    expect(mocked(Joke)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Humor renders Authenticated', () => {
    render(<Humor />)
    expect(mocked(Authenticated)).toHaveBeenCalledTimes(1)
  })
})
