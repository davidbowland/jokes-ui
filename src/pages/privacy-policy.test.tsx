import PrivacyPolicy from '@components/privacy-policy'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import PrivacyPage from './privacy-policy'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/privacy-policy')
jest.mock('@config/amplify')

describe('Privacy page', () => {
  beforeAll(() => {
    jest.mocked(PrivacyPolicy).mockReturnValue(<>PrivacyPolicy</>)
  })

  test('Rendering PrivacyPage also renders PrivacyPolicy', () => {
    render(<PrivacyPage />)
    expect(PrivacyPolicy).toHaveBeenCalledTimes(1)
  })
})
