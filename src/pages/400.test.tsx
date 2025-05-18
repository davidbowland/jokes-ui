import ServerErrorMessage from '@components/server-error-message'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import BadRequest from './400'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('400 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<>ServerErrorMessage</>)
  })

  test('expect rendering BadRequest renders ServerErrorMessage', () => {
    const expectedTitle = '400: Bad Request'
    render(<BadRequest />)
    expect(ServerErrorMessage).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything(),
    )
    expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
  })
})
