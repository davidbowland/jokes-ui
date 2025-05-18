import Navigation from '@components/navigation'
import PrivacyLink from '@components/privacy-link'
import { index } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import JokePage from './[index]'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/navigation')
jest.mock('@components/privacy-link')

describe('Joke page', () => {
  const indexParam = `${index}`

  beforeAll(() => {
    jest.mocked(Navigation).mockReturnValue(<>Navigation</>)
    jest.mocked(PrivacyLink).mockReturnValue(<>PrivacyLink</>)
  })

  test('expect rendering Index renders Joke', () => {
    render(<JokePage params={{ index: indexParam }} />)
    expect(Navigation).toHaveBeenCalledWith({ initialIndex: index }, {})
    expect(Navigation).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Index renders PrivacyLink', () => {
    render(<JokePage params={{ index: indexParam }} />)
    expect(PrivacyLink).toHaveBeenCalledTimes(1)
  })
})
