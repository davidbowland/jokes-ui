import '@testing-library/jest-dom'
import { mocked } from 'jest-mock'
import React from 'react'
import { render } from '@testing-library/react'

import BadRequest from './400'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('400 error page', () => {
  beforeAll(() => {
    mocked(ServerErrorMessage).mockReturnValue(<></>)
  })

  test('expect rendering BadRequest renders ServerErrorMessage', () => {
    const expectedTitle = '400: Bad Request'
    render(<BadRequest />)
    expect(mocked(ServerErrorMessage)).toBeCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything()
    )
    expect(mocked(ServerErrorMessage)).toBeCalledTimes(1)
  })
})
