import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import InternalServerError from './500'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@components/server-error-message', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('500 error page', () => {
  beforeAll(() => {
    ;(ServerErrorMessage as jest.Mock).mockReturnValue(<></>)
  })

  test('Rendering InternalServerError renders ServerErrorMessage', () => {
    const expectedTitle = '500: Internal Server Error'
    render(<InternalServerError />)
    expect(ServerErrorMessage).toBeCalledWith(expect.objectContaining({ title: expectedTitle }), expect.anything())
    expect(ServerErrorMessage).toBeCalledTimes(1)
  })
})
