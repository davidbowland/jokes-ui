import React from 'react'

import ServerErrorMessage from '@components/server-error-message'
import InternalServerError from '@pages/500'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('500 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<>ServerErrorMessage</>)
  })

  it('renders ServerErrorMessage', () => {
    const expectedTitle = '500: Internal Server Error'
    render(<InternalServerError />)
    expect(ServerErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: expectedTitle }), undefined)
    expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
  })

  it('renders title', () => {
    render(<InternalServerError />)
    expect(document.title).toBe('500: Internal Server Error | dbowland.com')
  })

  it('excludes the page from search indexes', () => {
    render(<InternalServerError />)
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  })
})
