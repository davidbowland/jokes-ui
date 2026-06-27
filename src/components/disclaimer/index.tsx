import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { AcceptButton, DrawerBody, DrawerContainer, DrawerTitle } from './elements'

const getCookie = (name: string): string | undefined =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]

const setCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${value}; path=/; SameSite=Strict; Secure`
}

const Disclaimer = (): React.ReactNode => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (getCookie('disclaimer_accept') !== 'true') {
      setOpen(true)
    }
  }, [])

  const closeDrawer = (): void => {
    setOpen(false)
    setCookie('disclaimer_accept', 'true')
  }

  if (!open) return null

  return (
    <DrawerContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10">
        <div className="flex flex-col gap-2">
          <DrawerTitle>Cookie and Privacy Disclosure</DrawerTitle>
          <DrawerBody>
            This site only uses essential cookies such as those used to keep you logged in. We collect no personally
            identifiable information and no contact information. Depending on your activity, your IP address may appear
            in our logs for up to 90 days. We never sell your information — we intentionally don&apos;t have information
            to sell.
          </DrawerBody>
          <DrawerBody>
            See our <Link href="/privacy-policy">privacy policy</Link> for more information.
          </DrawerBody>
        </div>
        <div className="flex-shrink-0">
          <AcceptButton onPress={closeDrawer} />
        </div>
      </div>
    </DrawerContainer>
  )
}

export default Disclaimer
