import '@testing-library/jest-dom'
import { mocked } from 'jest-mock'
import React from 'react'
import { render } from '@testing-library/react'

import IndexPage from './index'
import Joke from '@components/joke'
import PrivacyLink from '@components/privacy-link'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@components/privacy-link')

describe('Index page', () => {
  beforeAll(() => {
    mocked(Joke).mockReturnValue(<></>)
    mocked(PrivacyLink).mockReturnValue(<></>)
  })

  test('expect rendering Index renders Joke', () => {
    render(<IndexPage />)
    expect(mocked(Joke)).toHaveBeenCalledWith({}, {})
    expect(mocked(Joke)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Index renders PrivacyLink', () => {
    render(<IndexPage />)
    expect(mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })
})
