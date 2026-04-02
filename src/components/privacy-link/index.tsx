import Link from 'next/link'
import React from 'react'

const PrivacyLink = (): React.ReactNode => {
  return (
    <div className="text-center text-xs">
      <Link className="text-muted transition-colors hover:text-cream" href="/privacy-policy">
        Privacy policy
      </Link>
    </div>
  )
}

export default PrivacyLink
