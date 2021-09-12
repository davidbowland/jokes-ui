import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const AuthorizationRequired = (): JSX.Element => {
  return (
    <ServerErrorMessage title="401: Authorization Required">
      You have requested a resource that requires authorization. Please authenticate yourself before retrying your
      request.
    </ServerErrorMessage>
  )
}

export default AuthorizationRequired
