import Link from 'next/link'
import React from 'react'

const PolicySection = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="border-t border-coal/60 pt-6">
    <h6 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gold">{title}</h6>
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted">{children}</div>
  </div>
)

const PrivacyPolicy = (): React.ReactNode => (
  <div className="mx-auto max-w-2xl px-6 py-20">
    <div className="mb-14">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Legal</p>
      <h1 className="font-display text-4xl font-bold leading-tight text-cream sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">
        Reading jokes at{' '}
        <Link className="text-cream transition-colors hover:text-gold" href="https://jokes.dbowland.com/">
          jokes.dbowland.com
        </Link>{' '}
        takes no account, sets no cookie, and runs no analytics or ads. The site is meant for people 13 and older.
      </p>
    </div>

    <div className="flex flex-col gap-6">
      <PolicySection title="Server Logs">
        <p>
          Our server logs each request for 30 days, including your IP address. We never use those logs to work out who
          you are. Nobody else sees it unless a court order compels us to hand it over.
        </p>
      </PolicySection>

      <PolicySection title="Your Rights">
        <p>
          The law where you live may give you rights over your personal data — to see it, correct it, or have it
          deleted. To use them, or to ask anything else about this page, email{' '}
          <Link className="text-gold hover:underline" href="mailto:privacy@dbowland.com">
            privacy@dbowland.com
          </Link>
          .
        </p>
      </PolicySection>
    </div>

    <div className="mt-14 border-t border-coal/60 pt-8 flex items-center justify-between">
      <Link
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-cream"
        href="/"
      >
        <span aria-hidden="true">←</span>
        Back to Punchline
      </Link>
      <p className="text-xs text-muted">Effective August 10, 2026</p>
    </div>
  </div>
)

export default PrivacyPolicy
