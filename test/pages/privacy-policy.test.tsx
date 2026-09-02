import React from 'react'

import PrivacyPolicy from '@components/privacy-policy'
import PrivacyPage from '@pages/privacy-policy'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/privacy-policy')
jest.mock('@config/amplify')

describe('Privacy page', () => {
  beforeAll(() => {
    jest.mocked(PrivacyPolicy).mockReturnValue(<>PrivacyPolicy</>)
  })

  it('renders PrivacyPolicy', () => {
    render(<PrivacyPage />)
    expect(PrivacyPolicy).toHaveBeenCalledTimes(1)
  })

  it('renders title', () => {
    render(<PrivacyPage />)
    expect(document.title).toBe('Privacy Policy | jokes.dbowland.com')
  })

  it('names production as the canonical, so the test deploy does not compete with it', () => {
    render(<PrivacyPage />)
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://jokes.dbowland.com/privacy-policy/',
    )
  })
})
