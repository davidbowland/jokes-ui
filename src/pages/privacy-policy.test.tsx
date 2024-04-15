import '@testing-library/jest-dom'
import { mocked } from 'jest-mock'
import React from 'react'
import { render } from '@testing-library/react'

import PrivacyPage from './privacy-policy'
import PrivacyPolicy from '@components/privacy-policy'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/privacy-policy')

describe('Privacy page', () => {
  beforeAll(() => {
    mocked(PrivacyPolicy).mockReturnValue(<>PrivacyPolicy</>)
  })

  test('Rendering PrivacyPage also renders PrivacyPolicy', () => {
    render(<PrivacyPage />)
    expect(mocked(PrivacyPolicy)).toHaveBeenCalledTimes(1)
  })
})
