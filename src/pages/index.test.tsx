import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Humor from './index'
import Joke from '@components/joke'
import PrivacyLink from '@components/privacy-link'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@components/privacy-link')

describe('Humor page', () => {
  beforeAll(() => {
    mocked(Joke).mockReturnValue(<></>)
    mocked(PrivacyLink).mockReturnValue(<></>)
  })

  test('expect rendering Humor renders Joke', () => {
    render(<Humor />)
    expect(mocked(Joke)).toHaveBeenCalledWith({ initialize: true }, expect.anything())
    expect(mocked(Joke)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Humor renders PrivacyLink', () => {
    render(<Humor />)
    expect(mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })
})
