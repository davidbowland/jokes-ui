import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import Forbidden from './403'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('403 error page', () => {
  beforeAll(() => {
    ;(ServerErrorMessage as jest.Mock).mockReturnValue(<></>)
  })

  test('Rendering Forbidden renders ServerErrorMessage', () => {
    const expectedTitle = '403: Forbidden'
    render(<Forbidden />)
    expect(ServerErrorMessage).toBeCalledWith(expect.objectContaining({ title: expectedTitle }), expect.anything())
    expect(ServerErrorMessage).toBeCalledTimes(1)
  })
})
