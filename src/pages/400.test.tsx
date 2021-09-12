import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import BadRequest from './400'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@components/server-error-message', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('400 error page', () => {
  beforeAll(() => {
    ;(ServerErrorMessage as jest.Mock).mockReturnValue(<></>)
  })

  test('Rendering BadRequest renders ServerErrorMessage', () => {
    const expectedTitle = '400: Bad Request'
    render(<BadRequest />)
    expect(ServerErrorMessage).toBeCalledWith(expect.objectContaining({ title: expectedTitle }), expect.anything())
    expect(ServerErrorMessage).toBeCalledTimes(1)
  })
})
