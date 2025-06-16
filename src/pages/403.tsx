import ServerErrorMessage from '@components/server-error-message'
import { HeadFC } from 'gatsby'
import React from 'react'

const Forbidden = (): React.ReactNode => {
  return (
    <ServerErrorMessage title="403: Forbidden">
      You are not allowed to access the resource you requested. If you feel you have reached this page in error, please
      contact the webmaster.
    </ServerErrorMessage>
  )
}

export const Head: HeadFC = () => <title>403: Forbidden | dbowland.com</title>

export default Forbidden
