import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Humor from './index'
import Joke from '@components/joke'
import Themed from '@components/themed'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@components/themed')
jest.mock('@fontsource/rokkitt')

describe('Humor page', () => {
  beforeAll(() => {
    mocked(Joke).mockReturnValue(<></>)
    mocked(Themed).mockImplementation(({ children }) => <>{children}</>)
  })

  test('expect rendering Humor renders Joke', () => {
    render(<Humor />)
    expect(mocked(Joke)).toHaveBeenCalledWith({ initialize: true }, expect.anything())
    expect(mocked(Joke)).toHaveBeenCalledTimes(1)
  })
})
