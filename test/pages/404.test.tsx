import NotFound from '@pages/404'
import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('404 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<>ServerErrorMessage</>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '' },
    })
  })

  beforeEach(() => {
    window.location.pathname = '/an-invalid-page'
  })

  it('renders ServerErrorMessage', async () => {
    const expectedTitle = '404: Not Found'
    render(<NotFound />)
    await waitFor(() => {
      expect(ServerErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: expectedTitle }), undefined)
    })
    expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
  })

  it('does not render when path begins with /j/', () => {
    window.location.pathname = '/j/aeiou'
    render(<NotFound />)
    expect(ServerErrorMessage).not.toHaveBeenCalled()
  })

  it('renders when pathname has three slashes', async () => {
    window.location.pathname = '/j/aeiou/y'
    render(<NotFound />)
    await waitFor(() => {
      expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
    })
  })

  it('renders title', async () => {
    render(<NotFound />)
    await waitFor(() => {
      expect(document.title).toBe('404: Not Found | dbowland.com')
    })
  })
})
