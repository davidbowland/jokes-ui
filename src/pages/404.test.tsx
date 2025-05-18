import ServerErrorMessage from '@components/server-error-message'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import NotFound from './404'

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

  test('expect rendering NotFound renders ServerErrorMessage', () => {
    const expectedTitle = '404: Not Found'
    render(<NotFound />)
    expect(ServerErrorMessage).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything(),
    )
    expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
  })

  test('expect no render when path begins /j/', () => {
    window.location.pathname = '/j/aeiou'
    render(<NotFound />)
    expect(ServerErrorMessage).toHaveBeenCalledTimes(0)
  })

  test('expect render when pathname has three slashes', () => {
    window.location.pathname = '/j/aeiou/y'
    render(<NotFound />)
    expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
  })
})
