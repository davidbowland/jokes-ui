import type { GatsbyBrowser } from 'gatsby'
import React from 'react'

import '@config/amplify'
import Authenticated from '@components/auth'
import Themed from '@components/themed'

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element }): JSX.Element => {
  return (
    <Themed>
      <Authenticated>{element}</Authenticated>
    </Themed>
  )
}
