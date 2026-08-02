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
          When your browser asks our server for a joke, the request is written to a log: your IP address, the time, the
          address requested, and your browser&apos;s user-agent string. We keep these logs to see what breaks.
        </p>
        <p>
          We don&apos;t record which pages you view. The website keeps no access log of its own, so only requests that
          reach the joke API appear anywhere. Reading jokes requires no account, and we store nothing in your browser
          while you do it.
        </p>
      </PolicySection>

      <PolicySection title="If You Sign In">
        <p>
          Only site administrators can sign in — there is no public sign-up. Amazon Cognito holds an
          administrator&apos;s email address and phone number to manage the account. While signed in, the browser keeps
          the session token in local storage; no cookie is set.
        </p>
      </PolicySection>

      <PolicySection title="Read-Aloud Jokes">
        <p>
          When a joke is read aloud, its text is sent to Amazon Polly, which returns the audio. Polly receives the joke
          and nothing about you.
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
          don&apos;t run analytics. Beyond a standard server log — and an administrator&apos;s own contact details — we
          intentionally collect nothing that identifies you.
        </p>
      </PolicySection>

      <PolicySection title="Who Else Handles Your Data">
        <p>
          Amazon Web Services hosts this site, stores the logs, runs Cognito for administrator sign-in, and provides
          Polly for the read-aloud audio. Log lines recording an error are copied to a separate error-reporting function
          we run in the same AWS account.
        </p>
        <p>
          Nobody else receives your data. Beyond that hosting, we share it only when legally required — for example, in
          response to a valid court order or law enforcement request.
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
        <p>
          Server logs are deleted automatically after 30 days, as are the copied error lines. Administrator accounts
          last until we remove them.
        </p>
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
      <p className="text-xs text-muted/60">Effective August 1, 2026</p>
    </div>
  </div>
)

export default PrivacyPolicy
