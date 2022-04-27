import React from 'react'

import '@config/amplify'
import ServerErrorMessage from '@components/server-error-message'

const Forbidden = (): JSX.Element => {
  return (
    <ServerErrorMessage title="403: Forbidden">
      You are not allowed to access the resource you requested. If you feel you have reached this page in error, please
      contact the webmaster.
    </ServerErrorMessage>
  )
}

export default Forbidden
