import PrivacyPolicy from '@components/privacy-policy'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import PrivacyPage, { Head } from './privacy-policy'

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

  it('returns title in Head component', () => {
    const { container } = render(<Head {...({} as any)} />)
    expect(container).toMatchInlineSnapshot(`
      <div>
        <title>
          Privacy Policy | jokes.dbowland.com
        </title>
      </div>
    `)
  })
})
