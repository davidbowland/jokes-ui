import React from 'react'

import PrivacyPolicy from './index'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('privacy-policy component', () => {
  it('renders privacy policy', async () => {
    render(<PrivacyPolicy />)

    expect(screen.queryAllByText(/privacy policy/i).length).toBeGreaterThan(0)
  })

  it('discloses the IP address in the logs and how long they are kept', () => {
    render(<PrivacyPolicy />)

    expect(screen.getByText(/logs each request for 30 days, including your IP address/i)).toBeInTheDocument()
  })
})
