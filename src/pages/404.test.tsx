import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import NotFound from './404'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('404 error page', () => {
  beforeAll(() => {
    ;(ServerErrorMessage as jest.Mock).mockReturnValue(<></>)
  })

  test('Rendering NotFound renders ServerErrorMessage', () => {
    const expectedTitle = '404: Not Found'
    render(<NotFound />)
    expect(ServerErrorMessage).toBeCalledWith(expect.objectContaining({ title: expectedTitle }), expect.anything())
    expect(ServerErrorMessage).toBeCalledTimes(1)
  })
})
