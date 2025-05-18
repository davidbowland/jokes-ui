import ServerErrorMessage from '@components/server-error-message'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import Forbidden from './403'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('403 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<>ServerErrorMessage</>)
  })

  test('expect rendering Forbidden renders ServerErrorMessage', () => {
    const expectedTitle = '403: Forbidden'
    render(<Forbidden />)
    expect(ServerErrorMessage).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything(),
    )
    expect(ServerErrorMessage).toHaveBeenCalledTimes(1)
  })
})
