import '@testing-library/jest-dom'
import { mocked } from 'jest-mock'
import React from 'react'
import { render } from '@testing-library/react'

import IndexPage from './index'
import Navigation from '@components/navigation'
import PrivacyLink from '@components/privacy-link'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/navigation')
jest.mock('@components/privacy-link')

describe('Index page', () => {
  beforeAll(() => {
    mocked(Navigation).mockReturnValue(<>Navigation</>)
    mocked(PrivacyLink).mockReturnValue(<>PrivacyLink</>)
  })

  test('expect rendering Index renders Joke', () => {
    render(<IndexPage />)
    expect(mocked(Navigation)).toHaveBeenCalledWith({}, {})
    expect(mocked(Navigation)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Index renders PrivacyLink', () => {
    render(<IndexPage />)
    expect(mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })
})
