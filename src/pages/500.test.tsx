import { mocked } from 'jest-mock'
import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import InternalServerError from './500'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('500 error page', () => {
  beforeAll(() => {
    mocked(ServerErrorMessage).mockReturnValue(<></>)
  })

  test('Rendering InternalServerError renders ServerErrorMessage', () => {
    const expectedTitle = '500: Internal Server Error'
    render(<InternalServerError />)
    expect(mocked(ServerErrorMessage)).toBeCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything()
    )
    expect(mocked(ServerErrorMessage)).toBeCalledTimes(1)
  })
})
