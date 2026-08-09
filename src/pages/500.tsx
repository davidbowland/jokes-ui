import Head from 'next/head'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const InternalServerError = (): React.ReactNode => {
  return (
    <>
      <Head>
        <title>500: Internal Server Error | dbowland.com</title>
        <meta content="noindex, nofollow" name="robots" />
      </Head>
      <ServerErrorMessage title="500: Internal Server Error">
        An internal server error has occurred trying to serve your request. If you continue to experience this error,
        please contact the webmaster.
      </ServerErrorMessage>
    </>
  )
}

export default InternalServerError
