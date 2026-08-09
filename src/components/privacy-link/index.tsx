import Link from 'next/link'
import React from 'react'

const PrivacyLink = (): React.ReactNode => (
  <div className="text-center">
    <Link className="text-xs text-muted transition-colors duration-200 hover:text-cream" href="/privacy-policy">
      Privacy policy
    </Link>
  </div>
)

export default PrivacyLink
