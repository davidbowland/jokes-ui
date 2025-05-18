import ServerErrorMessage from '@components/server-error-message'
import React from 'react'

const InternalServerError = (): JSX.Element => {
  return (
    <ServerErrorMessage title="500: Internal Server Error">
      An internal server error has occurred trying to serve your request. If you continue to experience this error,
      please contact the webmaster.
    </ServerErrorMessage>
  )
}

export default InternalServerError
