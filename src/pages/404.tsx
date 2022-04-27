import React from 'react'

import '@config/amplify'
import ServerErrorMessage from '@components/server-error-message'

const NotFound = (): JSX.Element => {
  return (
    <ServerErrorMessage title="404: Not Found">
      The resource you requested is unavailable. If you feel you have reached this page in error, please contact the
      webmaster.
    </ServerErrorMessage>
  )
}

export default NotFound
