import Navigation from '@components/navigation'
import PrivacyLink from '@components/privacy-link'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import IndexPage from './index'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/navigation')
jest.mock('@components/privacy-link')

describe('Index page', () => {
  beforeAll(() => {
    jest.mocked(Navigation).mockReturnValue(<>Navigation</>)
    jest.mocked(PrivacyLink).mockReturnValue(<>PrivacyLink</>)
  })

  test('expect rendering Index renders Joke', () => {
    render(<IndexPage />)
    expect(Navigation).toHaveBeenCalledWith({}, {})
    expect(Navigation).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Index renders PrivacyLink', () => {
    render(<IndexPage />)
    expect(PrivacyLink).toHaveBeenCalledTimes(1)
  })
})
