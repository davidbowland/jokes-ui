import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import Humor from '.'
import Joke from '@components/joke'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('@fontsource/rokkitt')

describe('Humor page', () => {
  beforeAll(() => {
    ;(Joke as jest.Mock).mockReturnValue(<></>)
  })

  test('Rendering Humor renders Joke', () => {
    render(<Humor />)
    expect(Joke).toHaveBeenCalledWith({ initialize: true }, expect.anything())
    expect(Joke).toHaveBeenCalledTimes(1)
  })
})
