import '@testing-library/jest-dom'
import { mocked } from 'jest-mock'
import React from 'react'
import { render } from '@testing-library/react'

import { index } from '@test/__mocks__'
import JokePage from './[index]'
import Navigation from '@components/navigation'
import PrivacyLink from '@components/privacy-link'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/navigation')
jest.mock('@components/privacy-link')

describe('Joke page', () => {
  const indexParam = `${index}`

  beforeAll(() => {
    mocked(Navigation).mockReturnValue(<></>)
    mocked(PrivacyLink).mockReturnValue(<></>)
  })

  test('expect rendering Index renders Joke', () => {
    render(<JokePage params={{ index: indexParam }} />)
    expect(mocked(Navigation)).toHaveBeenCalledWith({ initialIndex: index }, {})
    expect(mocked(Navigation)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Index renders PrivacyLink', () => {
    render(<JokePage params={{ index: indexParam }} />)
    expect(mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })
})
