import Link from 'next/link'
import React from 'react'

const PrivacyLink = (): React.ReactNode => (
  <div className="text-center">
    <Link className="text-[11px] text-muted/70 transition-colors duration-200 hover:text-muted" href="/privacy-policy">
      Privacy policy
    </Link>
  </div>
)

export default PrivacyLink
