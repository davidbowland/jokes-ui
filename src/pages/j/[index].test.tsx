import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Joke from '@components/joke'
import JokePage from './[index]'
import PrivacyLink from '@components/privacy-link'
import { index } from '@test/__mocks__'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/joke')
jest.mock('@components/privacy-link')

describe('Joke page', () => {
  const indexParam = `${index}`

  beforeAll(() => {
    mocked(Joke).mockReturnValue(<></>)
    mocked(PrivacyLink).mockReturnValue(<></>)
  })

  test('expect rendering Index renders Joke', () => {
    render(<JokePage params={{ index: indexParam }} />)
    expect(mocked(Joke)).toHaveBeenCalledWith({ index }, {})
    expect(mocked(Joke)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Index renders PrivacyLink', () => {
    render(<JokePage params={{ index: indexParam }} />)
    expect(mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })
})
