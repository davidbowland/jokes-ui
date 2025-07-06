import { HeadFC } from 'gatsby'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const NotFound = (): React.ReactNode => {
  const display404 = typeof window !== 'undefined' && window.location.pathname.match(/^\/j\/[^/]+$/) === null
  if (display404) {
    return (
      <ServerErrorMessage title="404: Not Found">
        The resource you requested is unavailable. If you feel you have reached this page in error, please contact the
        webmaster.
      </ServerErrorMessage>
    )
  }
  return <></>
}

export const Head: HeadFC = () => <title>404: Not Found | dbowland.com</title>

export default NotFound
