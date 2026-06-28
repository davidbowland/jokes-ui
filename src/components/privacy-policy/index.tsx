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
        This policy describes how{' '}
        <Link className="text-cream transition-colors hover:text-gold" href="https://jokes.dbowland.com/">
          jokes.dbowland.com
        </Link>{' '}
        handles your data. The short version: we collect very little, we keep it briefly, and we never sell it.
      </p>
    </div>

    <div className="flex flex-col gap-6">
      <PolicySection title="What We Collect">
        <p>
          Our servers automatically log your IP address, browser type, and the pages you visit. We use these logs to
          detect abuse and keep the site running. If you log in, we set a session cookie to keep you authenticated.
          That&apos;s everything we collect.
        </p>
      </PolicySection>

      <PolicySection title="Why We Collect It">
        <p>
          We process server log data under legitimate interests — operating a secure, functional website. We don&apos;t
          rely on your consent, and we don&apos;t use your data for advertising or profiling.
        </p>
      </PolicySection>

      <PolicySection title="What We Don't Do">
        <p>
          We don&apos;t sell your data. We don&apos;t share it with advertisers. We don&apos;t build profiles. We
          intentionally don&apos;t collect contact information or anything personally identifying beyond what appears in
          a standard server log.
        </p>
      </PolicySection>

      <PolicySection title="When We Share Your Data">
        <p>
          We share data only when legally required — for example, in response to a valid court order or law enforcement
          request.
        </p>
      </PolicySection>

      <PolicySection title="Your Rights">
        <p>
          Depending on where you live, you may have legal rights over your personal data — such as the right to access,
          correct, or delete it. To exercise any such rights, contact us at{' '}
          <Link className="text-gold hover:underline" href="mailto:privacy@dbowland.com">
            privacy@dbowland.com
          </Link>
          .
        </p>
      </PolicySection>

      <PolicySection title="Data Retention">
        <p>Server logs are kept for up to 90 days, then deleted.</p>
      </PolicySection>

      <PolicySection title="Age">
        <p>This site is intended for people 13 and older.</p>
      </PolicySection>

      <PolicySection title="Changes">
        <p>
          If we change how we handle data in a meaningful way, we&apos;ll update this page. The date at the bottom
          reflects the last revision.
        </p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>
          Questions about this policy? Email{' '}
          <Link className="text-gold hover:underline" href="mailto:privacy@dbowland.com">
            privacy@dbowland.com
          </Link>{' '}
          or write to:
        </p>
        <p className="font-medium text-cream/70">
          dbowland.com Privacy
          <br />
          P.O. Box 81226, Seattle, WA 98108-1226
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
      <p className="text-xs text-muted/60">Last updated June 2026</p>
    </div>
  </div>
)

export default PrivacyPolicy
