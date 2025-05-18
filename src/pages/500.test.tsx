import ServerErrorMessage from '@components/server-error-message'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import InternalServerError from './500'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('500 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<>ServerErrorMessage</>)
  })

  test('expect rendering InternalServerError renders ServerErrorMessage', () => {
    const expectedTitle = '500: Internal Server Error'
    render(<InternalServerError />)
    expect(ServerErrorMessage).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything(),
    )
    expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
  })
})
