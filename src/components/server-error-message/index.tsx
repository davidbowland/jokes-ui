import Link from 'next/link'
import React from 'react'

import PrivacyLink from '@components/privacy-link'

export interface ServerErrorProps {
  children: React.ReactNode
  title: string
}

const ServerErrorMessage = ({ children, title }: ServerErrorProps): React.ReactNode => {
  const parts = title.split(': ')
  const numericCode = parts[0].match(/^\d+$/) ? parts[0] : null

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6">
      <div className="flex max-w-lg flex-col gap-8">
        {numericCode && (
          <div
            aria-hidden="true"
            className="font-display text-[7rem] font-bold leading-none text-gold/[0.12] sm:text-[9rem]"
          >
            {numericCode}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-bold text-cream">{title}</h1>
          <p className="text-sm leading-relaxed text-muted">{children}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            className="inline-flex w-max items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-background shadow-[0_2px_16px_rgba(224,74,87,0.3)] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            href="/"
          >
            <span aria-hidden="true">←</span>
            Go home
          </Link>
          <PrivacyLink />
        </div>
      </div>
    </div>
  )
}

export default ServerErrorMessage
