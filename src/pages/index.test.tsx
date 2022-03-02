import { mocked } from 'jest-mock'
import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import Humor from './index'
import Joke from '@components/joke'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@fontsource/rokkitt')

describe('Humor page', () => {
  beforeAll(() => {
    mocked(Joke).mockReturnValue(<></>)
  })

  test('Rendering Humor renders Joke', () => {
    render(<Humor />)
    expect(mocked(Joke)).toHaveBeenCalledWith({ initialize: true }, expect.anything())
    expect(mocked(Joke)).toHaveBeenCalledTimes(1)
  })
})
