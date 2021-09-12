import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import AuthorizationRequired from './401'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@components/server-error-message', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('401 error page', () => {
  beforeAll(() => {
    ;(ServerErrorMessage as jest.Mock).mockReturnValue(<></>)
  })

  test('Rendering AuthorizationRequired renders ServerErrorMessage', () => {
    const expectedTitle = '401: Authorization Required'
    render(<AuthorizationRequired />)
    expect(ServerErrorMessage).toBeCalledWith(expect.objectContaining({ title: expectedTitle }), expect.anything())
    expect(ServerErrorMessage).toBeCalledTimes(1)
  })
})
