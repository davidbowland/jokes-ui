import PrivacyLink from '@components/privacy-link'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

import ServerErrorMessage from './index'

jest.mock('@components/privacy-link')

describe('Server error message component', () => {
  const title = 'server-error-message'
  const children = 'Nothing to see here'

  beforeAll(() => {
    jest.mocked(PrivacyLink).mockReturnValue(<>PrivacyLink</>)
  })

  it('displays title in output', () => {
    render(<ServerErrorMessage title={title}> </ServerErrorMessage>)

    expect(screen.getByText(title)).toBeInTheDocument()
  })

  it('displays passed children in output', () => {
    render(<ServerErrorMessage title={title}>{children}</ServerErrorMessage>)

    expect(screen.getByText(children, { exact: false })).toBeInTheDocument()
  })

  it('includes link to home', () => {
    render(<ServerErrorMessage title={title}> </ServerErrorMessage>)

    const anchors = screen.getAllByRole('link') as HTMLAnchorElement[]
    expect(anchors.filter((link) => new URL(link.href).pathname === '/').length).toBe(1)
  })

  it('includes privacy link', () => {
    render(<ServerErrorMessage title={title}> </ServerErrorMessage>)

    expect(PrivacyLink).toHaveBeenCalledTimes(1)
  })
})
