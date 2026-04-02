import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import Disclaimer from './index'

describe('disclaimer component', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      value: '',
      writable: true,
    })
  })

  it('loads under normal circumstances', async () => {
    render(<Disclaimer />)

    expect(await screen.findByText(/Accept & continue/i)).toBeVisible()
  })

  it('closes when button clicked', async () => {
    render(<Disclaimer />)

    const closeButton = (await screen.findByText(/Accept & continue/i, {
      selector: 'button',
    })) as HTMLButtonElement
    await userEvent.click(closeButton)

    expect(document.cookie).toContain('disclaimer_accept=true')
    expect(screen.queryByText(/Cookie and Privacy Disclosure/i)).not.toBeInTheDocument()
  })

  it('loads closed when cookie is set', async () => {
    document.cookie = 'disclaimer_accept=true'
    render(<Disclaimer />)

    expect(screen.queryByText(/Cookie and Privacy Disclosure/i)).not.toBeInTheDocument()
  })
})
